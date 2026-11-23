// Re-encodes a video to 720p H.264 + AAC, sized to land under a target file
// size, using macOS's built-in AVFoundation (the engine avconvert uses; no
// ffmpeg). avconvert's presets can't cap file size, so this sets the bitrate.
//
// usage: swift scripts/compress.swift in.mov out.mp4 [maxMB=7.5]
import AVFoundation

let args = CommandLine.arguments
let src = URL(fileURLWithPath: args[1])
let dst = URL(fileURLWithPath: args[2])
let maxMB = args.count > 3 ? Double(args[3])! : 7.5
try? FileManager.default.removeItem(at: dst)

let asset = AVURLAsset(url: src)
let duration = CMTimeGetSeconds(asset.duration)
guard let vTrack = asset.tracks(withMediaType: .video).first else { fatalError("no video track") }
let aTrack = asset.tracks(withMediaType: .audio).first

// 720 on the short side, keeping the aspect ratio (even numbers for H.264)
let shown = vTrack.naturalSize.applying(vTrack.preferredTransform)
let (w0, h0) = (abs(shown.width), abs(shown.height))
let scale = min(1, 720 / min(w0, h0))   // never upscale
let even = { (v: CGFloat) -> Int in Int((v * scale / 2).rounded()) * 2 }
// encoder works in the track's natural orientation; the transform rotates it back
let natural = vTrack.naturalSize
let rotated = abs(natural.width - w0) > 1
let (encW, encH) = rotated ? (even(h0), even(w0)) : (even(w0), even(h0))

let audioBps = duration > 45 ? 96_000.0 : 128_000.0
// whatever fits under maxMB, between 0.5 and 3.5 Mbps
let videoBps = max(500_000, min(3_500_000, (maxMB * 8_000_000 * 0.95) / duration - audioBps))

let reader = try AVAssetReader(asset: asset)
let writer = try AVAssetWriter(outputURL: dst, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true

let vOut = AVAssetReaderTrackOutput(track: vTrack, outputSettings: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange,
])
reader.add(vOut)
let vIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: encW,
  AVVideoHeightKey: encH,
  AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: Int(videoBps),
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
  ],
])
vIn.transform = vTrack.preferredTransform
vIn.expectsMediaDataInRealTime = false
writer.add(vIn)

var aOut: AVAssetReaderTrackOutput?
var aIn: AVAssetWriterInput?
if let aTrack {
  let o = AVAssetReaderTrackOutput(track: aTrack, outputSettings: [AVFormatIDKey: kAudioFormatLinearPCM])
  reader.add(o); aOut = o
  let i = AVAssetWriterInput(mediaType: .audio, outputSettings: [
    AVFormatIDKey: kAudioFormatMPEG4AAC, AVNumberOfChannelsKey: 2, AVSampleRateKey: 44100, AVEncoderBitRateKey: Int(audioBps),
  ])
  writer.add(i); aIn = i
}

reader.startReading()
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let group = DispatchGroup()
func pump(_ input: AVAssetWriterInput, _ output: AVAssetReaderTrackOutput, _ label: String) {
  group.enter()
  input.requestMediaDataWhenReady(on: DispatchQueue(label: label)) {
    while input.isReadyForMoreMediaData {
      if let buf = output.copyNextSampleBuffer() { input.append(buf) }
      else { input.markAsFinished(); group.leave(); return }
    }
  }
}
pump(vIn, vOut, "video")
if let aIn, let aOut { pump(aIn, aOut, "audio") }
group.wait()

let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
if writer.status != .completed { fatalError("export failed: \(String(describing: writer.error))") }

let bytes = (try FileManager.default.attributesOfItem(atPath: dst.path)[.size] as! NSNumber).intValue
print(String(format: "%@: %dx%d, %.1fs, %.1f MB", dst.lastPathComponent, rotated ? encH : encW, rotated ? encW : encH, duration, Double(bytes) / 1_000_000))
