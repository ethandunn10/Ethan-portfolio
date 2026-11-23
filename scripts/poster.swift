// Saves the first frame of a video as a JPEG poster.
// usage: swift scripts/poster.swift in.mp4 out.jpg
import AVFoundation
import AppKit

let args = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero
let cg = try gen.copyCGImage(at: .zero, actualTime: nil)
let rep = NSBitmapImageRep(cgImage: cg)
let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.82])!
try data.write(to: URL(fileURLWithPath: args[2]))
print("poster \(cg.width)x\(cg.height) -> \(args[2])")
