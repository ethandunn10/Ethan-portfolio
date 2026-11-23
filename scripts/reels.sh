#!/bin/zsh
# Prepare the 3 reels for the site. Drop the originals in public/reels/ as
# reel1.*, reel2.*, reel3.* (any video type), then run:  zsh scripts/reels.sh
# Each becomes assets/reels/reelN.mp4 (720p, under 8 MB, built-in macOS
# AVFoundation, no ffmpeg) plus reelN.jpg, its first frame as a poster.
# Originals are moved to ~/Desktop/reel-originals/ so nothing is lost.
setopt null_glob
cd "$(dirname "$0")/.."
for n in 1 2 3; do
  src=""
  for f in public/reels/reel$n.* assets/reels/reel$n.*; do
    case "$f" in *.jpg) ;; assets/reels/reel$n.mp4) [ -z "$src" ] && src="$f" ;; *) src="$f" ;; esac
  done
  [ -z "$src" ] && { echo "reel$n: no file yet"; continue; }
  mkdir -p ~/Desktop/reel-originals
  orig=~/Desktop/reel-originals/$(basename "$src")
  mv "$src" "$orig"
  swift scripts/compress.swift "$orig" assets/reels/reel$n.mp4 7.5 2>/dev/null
  swift scripts/poster.swift assets/reels/reel$n.mp4 assets/reels/reel$n.jpg 2>/dev/null
done
