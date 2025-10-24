import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../styles/fliptile.css";

const FlipTile = () => {
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Setup card 3D properties
    gsap.set(wrapperRef.current, { perspective: 800 });
    gsap.set(cardRef.current, { transformStyle: "preserve-3d" });

    const front = cardRef.current.querySelector(".front");
    const back = cardRef.current.querySelector(".back");

    gsap.set(back, { rotationY: -180 });
    gsap.set([front, back], { backfaceVisibility: "hidden" });

    // Hover flip animation
    const handleEnter = () => {
      gsap.to(cardRef.current, {
        duration: 1.2,
        rotationY: 180,
        ease: "back.out(1.7)",
      });
    };

    const handleLeave = () => {
      gsap.to(cardRef.current, {
        duration: 1.2,
        rotationY: 0,
        ease: "back.out(1.7)",
      });
    };

    const wrapper = wrapperRef.current;
    wrapper.addEventListener("mouseenter", handleEnter);
    wrapper.addEventListener("mouseleave", handleLeave);

    // Intro animation (flips once on mount)
    gsap.to(cardRef.current, {
      duration: 1,
      rotationY: -180,
      repeat: 1,
      yoyo: true,
      stagger: 0.1,
      ease: "power1.inOut",
    });

    return () => {
      wrapper.removeEventListener("mouseenter", handleEnter);
      wrapper.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div className="home-tile" style={{ aspectRatio: "1/1" }}>
      <div className="cardWrapper" ref={wrapperRef}>
        <div className="card" ref={cardRef}>
          <div className="cardFace front">
            <h1>Front asdnjaskl;fnalfsnn;k</h1>
            
          </div>
          <div className="cardFace back">
            <h1>Back</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipTile;
