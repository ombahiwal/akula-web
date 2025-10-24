import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../styles/hometile.css";

const HomeTile = ({ frontContent, backContent, direction = "x" }) => {
  const wrapperRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    // Initialize positions depending on direction (x or y)
    const axis = direction === "y" ? "yPercent" : "xPercent";
    const hideValue = 100;

    gsap.set(backRef.current, { [axis]: hideValue });

    const handleEnter = () => {
      gsap.to(frontRef.current, {
        duration: 0.8,
        [axis]: -hideValue,
        ease: "power2.inOut",
      });
      gsap.to(backRef.current, {
        duration: 0.8,
        [axis]: 0,
        ease: "power2.inOut",
      });
    };

    const handleLeave = () => {
      gsap.to(frontRef.current, {
        duration: 0.8,
        [axis]: 0,
        ease: "power2.inOut",
      });
      gsap.to(backRef.current, {
        duration: 0.8,
        [axis]: hideValue,
        ease: "power2.inOut",
      });
    };

    const wrapper = wrapperRef.current;
    wrapper.addEventListener("mouseenter", handleEnter);
    wrapper.addEventListener("mouseleave", handleLeave);

    return () => {
      wrapper.removeEventListener("mouseenter", handleEnter);
      wrapper.removeEventListener("mouseleave", handleLeave);
    };
  }, [direction]);

  return (
    <div className="home-tile  d-flex bg-white text-white " style={{ aspectRatio: "1 / 1" }}>
      <div className="cardWrapper" ref={wrapperRef}>
        <div className="card">
          <div className="cardFace front" ref={frontRef}>
            {frontContent}
          </div>
          <div className="cardFace back" ref={backRef}>
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTile;
