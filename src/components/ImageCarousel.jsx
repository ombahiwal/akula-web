import React, { useState, useEffect, useRef } from "react";
import { Image } from "react-bootstrap";
import { gsap } from "gsap";
import '../styles/Eventpage.css';

const ImageCarousel = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);

  // Auto-advance slides
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  // Animate slide
  useEffect(() => {
    if (!trackRef.current) return;

    gsap.to(trackRef.current, {
      x: `-${currentIndex * 100}%`,
      duration: 0.8,
      ease: "power2.inOut",
    });
  }, [currentIndex]);

  if (!images || images.length === 0) return null;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        background: "none",
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          width: `${images.length * 100}%`,
          height: "100%",
        }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            
            style={{
             flex: "0 0 100%",
              width: "100%",
              height: "100%",
              display: "grid",               // use grid to perfectly center
              placeItems: "left",  
            }}
          >
            <Image
              className="slide-img"
              src={img}
              alt={`Slide ${idx}`}
              // fluid
              style={{
               
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
