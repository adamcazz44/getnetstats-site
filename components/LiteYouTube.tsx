"use client";

import { useState } from "react";

/**
 * Privacy-friendly, performance-first YouTube embed. Shows the poster thumbnail
 * + a play button; the actual player (youtube-nocookie.com) only loads when the
 * user clicks play — so the page stays fast and Google/YouTube isn't loaded (no
 * cookies) until the visitor opts in. Disclosed in the Privacy Policy.
 */
export default function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <div className="lyt">
      {play ? (
        <iframe
          className="lyt-iframe"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="lyt-poster"
          onClick={() => setPlay(true)}
          aria-label={`Play video: ${title}`}
          style={{ backgroundImage: `url(${poster})` }}
        >
          <span className="lyt-play" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
