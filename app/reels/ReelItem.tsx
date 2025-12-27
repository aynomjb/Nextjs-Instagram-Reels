"use client";

import { useEffect, useRef, useState } from "react";


/* ---------------- Comment Bottom Sheet ---------------- */
function CommentSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h3>Comments</h3>

        <div className="comments">
          <p>No comments yet</p>
        </div>

        <input
          className="comment-input"
          placeholder="Add a comment..."
        />
      </div>
    </div>
  );
}

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

  const lastTap = useRef(0);
  const heartRef = useRef<HTMLDivElement>(null);

  const [openComments, setOpenComments] = useState(false);

  /* ---------- Like (Optimistic UI) ---------- */
  const toggleLike = async () => {
    const prevLiked = liked;

    setLiked(!prevLiked);
    setLikes((l) => (prevLiked ? l - 1 : l + 1));

    try {
      await fetch(`/api/reels/${reelId}/like`, {
        method: "POST",
      });
    } catch {
      // rollback if API fails
      setLiked(prevLiked);
      setLikes((l) => (prevLiked ? l + 1 : l - 1));
    }

  };

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


  /* ---------- Heart Animation ---------- */
  const showHeart = () => {
    if (!heartRef.current) return;
    heartRef.current.classList.add("show");
    setTimeout(
      () => heartRef.current?.classList.remove("show"),
      700
    );
  };

  /* ---------- Double Tap Detection ---------- */
  const handleTap = () => {

    const now = Date.now();

    // Double tap → like
    if (now - lastTap.current < 300) {
      if (!liked) toggleLike();
      showHeart();
    }


    lastTap.current = now;


  };



  return (
    <div className="reel" onClick={handleTap}>

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

      {/* Heart Animation */}
      <div ref={heartRef} className="heart-animate">
        ❤️
      </div>

      {/* Right Side Overlay */}
      <div className="overlay">
        <button className="action-btn" onClick={toggleLike} >
          <span className={liked ? "liked" : ""}>❤️</span>
          <p>{likes}</p>
        </button>

        <button
          className="action-btn"
          onClick={() => setOpenComments(true)}
        >
          💬
          <p>210</p>
        </button>

        <button className="action-btn">
          🔗
          <p>Share</p>
        </button>
      </div>

      {/* Comment Sheet */}
      <CommentSheet
        open={openComments}
        onClose={() => setOpenComments(false)}
      />

    </div>
  );
}