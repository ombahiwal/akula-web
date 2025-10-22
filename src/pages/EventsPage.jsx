import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Eventpage.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const events = [
  {
    year: "2020.10",
    title: "AKULA founded at EPFL",
    image: "https://placehold.co/400x300?text=2020.10",
  },
 

  {
    year: "2021",
    title: "First design exhibition",
    image: "https://placehold.co/400x300?text=2021",
  },
  {
    year: "2022",
    title: "Cross-border collaborations",
    image: "https://placehold.co/400x300?text=2022",
  },
  {
    year: "2023",
    title: "Swiss–Ukrainian symposium",
    image: "https://placehold.co/400x300?text=2023img",
  },
  {
    year: "2024",
    title: "Digital platform launch",
    image: "https://placehold.co/400x300?text=2024",
  },
  {
    year: "2025",
    title: "New initiatives",
    image: "https://placehold.co/400x300?text=2025",
  },
];

const EventsPage = () => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  itemsRef.current = itemsRef.current || [];

  const [currentYear, setCurrentYear] = useState(events[0].year);
  const [currentImage, setCurrentImage] = useState(events[0].image);

  const setItemRef = (el, idx) => {
    itemsRef.current[idx] = el;
  };

  useEffect(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const highlightItem = (index) => {
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        const titleEl = item.querySelector(".event-timeline-entity-title") || item;
        gsap.to(titleEl, {
          color: i === index ? "#ffd700" : "#0057b8",
          scale: i === index ? 1.02 : 1,
          transformOrigin: "left center",
          duration: 0.25,
          overwrite: true,
        });
      });
    };

    const triggers = itemsRef.current.map((el, i) => {
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        scroller: containerRef.current || undefined,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          setCurrentYear(events[i].year);
          setCurrentImage(events[i].image);
          highlightItem(i);
        },
        onEnterBack: () => {
          setCurrentYear(events[i].year);
          setCurrentImage(events[i].image);
          highlightItem(i);
        },
      });
    });

    ScrollTrigger.refresh();
    highlightItem(0);

    return () => {
      triggers.forEach((t) => t && t.kill && t.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Scroll to event on click
 const scrollToEvent = (index) => {
  if (!itemsRef.current[index] || !containerRef.current) return;

  const el = itemsRef.current[index];
  const top = el.offsetTop;

  gsap.to(containerRef.current, {
    duration: 0.8,
    ease: "power2.out",
    scrollTo: { y: top, autoKill: true },
    onComplete: () => {
      setCurrentYear(events[index].year);
      setCurrentImage(events[index].image);

      // highlight clicked item
      itemsRef.current.forEach((item, i) => {
        const titleEl = item.querySelector(".event-timeline-entity-title");
        gsap.to(titleEl, {
          color: i === index ? "#ffd700" : "#888888",
          scale: i === index ? 1.02 : 1,
          duration: 0.25,
        });
      });
    },
  });
};


  return (
    <div className="events-page bg-black text-white">
      <Container fluid className="h-100 py-5">
        <Row>
          {/* Left sticky column */}
          <Col sm={1} md={6} lg={4} >
            <div className="sticky-col event-fixed text-center">
            {/* <div className="events-back-arrow">←</div> */}
              <div className="event-current-year">{currentYear}</div>
              <div className="event-current-image mt-3">
                <img
                  src={currentImage}
                  alt={currentYear}
                  className="img-fluid event-image"
                />
              </div>
            </div>
          </Col>

          {/* Right: scrollable list */}
          <Col
            sm={11} md={6} lg={8}
            ref={containerRef}
            className="events-list-container"
          >
            {events.map((event, idx) => (
              <div
                key={idx}
                ref={(el) => setItemRef(el, idx)}
                className="event-timeline-entity py-3"
                onClick={() => scrollToEvent(idx)}
                style={{ cursor: "pointer" }}
              >
                <div className="event-content">
                  <div className="event-timeline-entity-title">
                    {event.title}
                  </div>
                </div>
                <div className="event-dot" />
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EventsPage;
