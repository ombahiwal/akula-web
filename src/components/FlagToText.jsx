import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

// Register MorphSVGPlugin (if you have Club GreenSock)
gsap.registerPlugin(MorphSVGPlugin);

const FlagToText = () => {
  const blueRef = useRef(null);
  const yellowRef = useRef(null);
  const textPathRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 2, ease: "power2.inOut" } });

    // Morph top blue rectangle to top of "AKULA" path
    tl.to(blueRef.current, { morphSVG: textPathRef.current }, 0);

    // Morph bottom yellow rectangle to bottom of "AKULA" path
    tl.to(yellowRef.current, { morphSVG: textPathRef.current }, 0);
  }, []);

  return (
    <div style={{ width: "300px", aspectRatio: "1/1", border: "1px solid #ccc" }}>
      <svg viewBox="0 0 300 300" width="100%" height="100%">
        {/* Blue rectangle */}
        <path
          ref={blueRef}
          d="M0 0 H300 V150 H0 Z"
          fill="#0057b7"
        />

        {/* Yellow rectangle */}
        <path
          ref={yellowRef}
          d="M0 150 H300 V300 H0 Z"
          fill="#ffd700"
        />

        <path style={{ visibility: "hidden" }} ref={textPathRef} d="M0 46.50L11.20 13.50L23.00 13.50L34.20 46.50L25.40 46.50L17.50 19.80L16.70 19.80L8.80 46.50L0 46.50M6.65 40.30L6.65 34.90L28.75 34.90L28.75 40.30L6.65 40.30ZM38.35 46.50L38.35 13.50L46.40 13.50L46.40 27.95Q48.85 26.85 50.95 25.20Q53.05 23.55 54.67 21.60Q56.30 19.65 57.38 17.57Q58.45 15.50 58.95 13.50L68.25 13.50Q67.65 15.80 66.30 18.17Q64.95 20.55 63.05 22.72Q61.15 24.90 58.98 26.60Q56.80 28.30 54.55 29.30L54.55 30.05Q56.85 30.05 58.63 30.55Q60.40 31.05 61.77 32.10Q63.15 33.15 64.17 34.73Q65.20 36.30 65.95 38.50L68.80 46.50L59.65 46.50L57.80 39.95Q57.20 37.75 56.20 36.48Q55.20 35.20 53.55 34.63Q51.90 34.05 49.30 34.05L46.40 34.05L46.40 46.50L38.35 46.50ZM88.15 47.20Q85 47.20 82.55 46.58Q80.10 45.95 78.30 44.75Q76.50 43.55 75.33 41.85Q74.15 40.15 73.58 38.02Q73 35.90 73 33.40L73 13.50L81.10 13.50L81.10 33.15Q81.10 35.55 81.85 37.10Q82.60 38.65 84.15 39.38Q85.70 40.10 88.10 40.10Q90.50 40.10 92.05 39.38Q93.60 38.65 94.35 37.10Q95.10 35.55 95.10 33.15L95.10 13.50L103.15 13.50L103.15 33.40Q103.15 39.95 99.42 43.58Q95.70 47.20 88.15 47.20ZM109.85 46.50L109.85 13.50L117.90 13.50L117.90 46.50L109.85 46.50M111.30 46.50L111.30 39.75L131.35 39.75L131.35 46.50L111.30 46.50ZM132.55 46.50L143.75 13.50L155.55 13.50L166.75 46.50L157.95 46.50L150.05 19.80L149.25 19.80L141.35 46.50L132.55 46.50M139.20 40.30L139.20 34.90L161.30 34.90L161.30 40.30L139.20 40.30Z"/>
      </svg>
    </div>
  );
};

export default FlagToText;
