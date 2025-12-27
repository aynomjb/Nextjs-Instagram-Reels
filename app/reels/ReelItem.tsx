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

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(1200);

  /* ---------- Auto Play / Pause ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
          setMuted(true); // 🔥 important
        }
      },
      { threshold: 0.75 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);


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

      {/* Right Side Overlay */}
      <div className="overlay">
        <button className="action-btn" >
          <span className={liked ? "liked" : ""}>❤️</span>
          <p>{likes}</p>
        </button>

        <button
          className="action-btn"
        >
          💬
          <p>210</p>
        </button>

        <button className="action-btn">
          🔗
          <p>Share</p>
        </button>
      </div>

    </div>
  );
}