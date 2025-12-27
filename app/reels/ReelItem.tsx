"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------- Reel Item ---------------- */
export default function ReelItem({
  src,
  reelId = "demo-id",
  username = "anishadev",
  caption = "Building Instagram Reels UI in Next.js 🔥",
  music = "Original Audio • anishadev",
}: {
  src: string;
  reelId?: string;
  username?: string;
  caption?: string;
  music?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  return (
    <div className="reel" >
      
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="reel-video"
      />

    </div>
  );
}