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

  const [progress, setProgress] = useState(0);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (!seeking) {
        setProgress((video.currentTime / video.duration) * 100 || 0);
      }
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, [seeking]);


  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const value = Number(e.target.value);
    const time = (value / 100) * video.duration;

    video.currentTime = time;
    setProgress(value);
  };

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

      <div className="left-stack">
        {/* Profile row */}
        <div className="profile-info">
          <img src="avatars/user1.jpg" className="profile-avatar" />

          <div className="profile-text">
            <div className="username-row">
              <span className="profile-name">@{username}</span>
              <button className="follow-btn">Follow</button>
            </div>

            <div className="music-marquee">
              <span>🎵 {music}</span>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="caption">{caption}</p>

        {/* Liked by */}
        <div className="liked-by-row">
          <div className="liked-avatars">
            <img src="/avatars/user1.jpg" />
            {/* <img src="/avatar2.png" />
            <img src="/avatar3.png" /> */}
          </div>

          <p className="liked-by-text">
            Liked by <strong>this user</strong> and{" "}
            <strong>{likes.toLocaleString()}</strong> others
          </p>
        </div>
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

      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        className="video-progress"
        style={{ "--progress": `${progress}%` } as React.CSSProperties}
        onMouseDown={() => setSeeking(true)}
        onMouseUp={() => setSeeking(false)}
        onTouchStart={() => setSeeking(true)}
        onTouchEnd={() => setSeeking(false)}
        onChange={handleSeek}
      />

    </div>
  );
}