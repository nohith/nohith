import { useEffect, useRef } from "react";
import showreel from "@/assets/nohith-showreel.mp4.asset.json";

/**
 * Scroll-scrubbed video: the playhead follows scroll progress through a tall
 * wrapper, smoothed with a requestAnimationFrame lerp so motion feels fluid
 * instead of stepping frame-to-frame.
 */
export function ScrollScrubVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    let target = 0;
    let current = 0;
    let raf = 0;
    let duration = 0;

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, scrollable)));
      target = progress * duration;
      if (captionRef.current) {
        // Caption is fully visible mid-scroll, fades in and out at the edges.
        const fade = Math.min(1, Math.min(progress, 1 - progress) * 6);
        captionRef.current.style.opacity = fade.toFixed(3);
        captionRef.current.style.transform = `translateY(${(1 - fade) * 24}px)`;
      }
    };

    const tick = () => {
      // Lerp toward the scroll target — this is what makes the scrub smooth.
      current += (target - current) * 0.12;
      if (duration > 0 && Math.abs(video.currentTime - current) > 0.03) {
        video.currentTime = current;
      }
      raf = requestAnimationFrame(tick);
    };

    const onReady = () => {
      duration = video.duration || 0;
      measure();
    };

    video.addEventListener("loadedmetadata", onReady);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    if (video.readyState >= 1) onReady();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onReady);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="scrub-section" ref={wrapRef} aria-label="Cinematic portrait reel">
      <div className="scrub-sticky">
        <div className="scrub-frame">
          <video
            ref={videoRef}
            src={showreel.url}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
          />
          <div className="scrub-vignette" />
        </div>
        <div className="scrub-caption" ref={captionRef}>
          <span className="scrub-eyebrow">In motion</span>
          <p>
            Technology, people &amp; business —<br />
            <span className="soft">always moving forward.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
