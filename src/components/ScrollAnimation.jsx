import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Scrollbar from "smooth-scrollbar";
import "../styles/Eventpage.css";

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {
  const scrollerRef = useRef(null);
  const bodyScrollBar = useRef(null);

  useEffect(() => {
    if (!scrollerRef.current) return;

    // Initialize Smooth Scrollbar
    bodyScrollBar.current = Scrollbar.init(scrollerRef.current, {
      damping: 0.1,
    });

    // Set up ScrollTrigger scroller proxy
    ScrollTrigger.scrollerProxy(scrollerRef.current, {
      scrollTop(value) {
        if (arguments.length) {
          bodyScrollBar.current.scrollTop = value;
        }
        return bodyScrollBar.current.scrollTop;
      },
    });

    bodyScrollBar.current.addListener(ScrollTrigger.update);

    // === Panels setup ===
    gsap.set(".panel", {
      zIndex: (i, target, targets) => targets.length - i,
    });

    const images = gsap.utils.toArray(".panel:not(.purple)");

    images.forEach((image, i) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "section.black",
          scroller: scrollerRef.current,
          start: () => "top -" + window.innerHeight * (i + 0.5),
          end: () => "+=" + window.innerHeight,
          scrub: true,
          toggleActions: "play none reverse none",
          invalidateOnRefresh: true,
        },
      });

      tl.to(image, { height: 0 });
    });

    // === Text setup ===
    gsap.set(".panel-text", {
      zIndex: (i, target, targets) => targets.length - i,
    });

    const texts = gsap.utils.toArray(".panel-text");

    texts.forEach((text, i) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "section.black",
          scroller: scrollerRef.current,
          start: () => "top -" + window.innerHeight * i,
          end: () => "+=" + window.innerHeight,
          scrub: true,
          toggleActions: "play none reverse none",
          invalidateOnRefresh: true,
        },
      });

      tl.to(text, { duration: 0.33, opacity: 1, y: "50%" })
        .to(text, { duration: 0.33, opacity: 0, y: "0%" }, 0.66);
    });

    // === Main ScrollTrigger Pin ===
    ScrollTrigger.create({
      trigger: "section.black",
      scroller: scrollerRef.current,
      scrub: true,
      markers: true,
      pin: true,
      start: "top top",
      end: () => "+=" + (images.length + 1) * window.innerHeight,
      invalidateOnRefresh: true,
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (bodyScrollBar.current) bodyScrollBar.current.destroy();
    };
  }, []);

  return (
    <div className="scroller" ref={scrollerRef}>
      <section className="orange">
        <div className="text">This is some text inside of a div block.</div>
      </section>

      <section className="black">
        <div className="text-wrap">
          <div className="panel-text blue-text">Blue</div>
          <div className="panel-text red-text">Red</div>
          <div className="panel-text orange-text">Orange</div>
          <div className="panel-text purple-text">Purple</div>
        </div>

        <div className="p-wrap">
          <div className="panel blue"></div>
          <div className="panel red"></div>
          <div className="panel orange"></div>
          <div className="panel purple"></div>
        </div>
      </section>

      <section className="blue"></section>
    </div>
  );
};

export default ScrollAnimation;
