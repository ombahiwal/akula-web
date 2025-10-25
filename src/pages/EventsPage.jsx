import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { getContent } from "../api/cfclient";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Eventpage.css";
import ImageCarousel from "../components/ImageCarousel";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function parseDateTime(isoString) {
  const [datePart, timePart] = isoString.split("T");
  const [year, month, day] = datePart.split("-");

  return {
    year,
    month,
    day,
    time: timePart || "00:00", // fallback if no time
  };
}

const EventsPage = () => {
  const [events, setEvents] = useState([]); // fetched events
  const [currentYear, setCurrentYear] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  itemsRef.current = itemsRef.current || [];

  const setItemRef = (el, idx) => {
    itemsRef.current[idx] = el;
  };

  // Fetch events from API
  useEffect(() => {
  getContent("info_section").then((data_resp) => {
    console.log(data_resp)
    // Ensure data_resp.items exists and is an array
    const fetchedEvents = data_resp['eventsTimeline'].map((item) => ({
          dt:parseDateTime(item.fields?.eventDate),
          year: item.fields?.eventDate || "",
          title: item.fields?.eventTitle || "",
          image: item.fields?.images || "https://placehold.co/400x300?text=no-image",
        }));

    setEvents(fetchedEvents);

    if (fetchedEvents.length > 0) {
      setCurrentYear(fetchedEvents[0].dt.year);
      setCurrentImage(fetchedEvents[0].image);
    }
  }).catch((err) => {
    console.error("Failed to fetch events:", err);
  });
}, []);


  // Initialize GSAP ScrollTriggers **after events are loaded**
  useEffect(() => {
    if (!events.length) return;

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
          setCurrentYear(events[i].dt.year);
          setCurrentImage(events[i].image);
          highlightItem(i);
        },
        onEnterBack: () => {
          setCurrentYear(events[i].dt.year);
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
  }, [events]); // run effect whenever events change

  // Scroll to specific event
  const scrollToEvent = (index) => {
    if (!itemsRef.current[index] || !containerRef.current) return;
    const el = itemsRef.current[index];
    const top = el.offsetTop - window.innerHeight / 2;

    gsap.to(containerRef.current, {
      duration: 0.8,
      ease: "power2.out",
      scrollTo: { y: top, autoKill: true },
      onComplete: () => {
        setCurrentYear(events[index].dt.year);
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
        <Row ref={containerRef} className="events-list-container">
          {/* Left sticky column */}
          <Col sm={1} md={6} lg={4}>
            <div className="sticky-col event-fixed text-center">
              <div className="event-current-year">{currentYear}</div>
              <div className="event-current-image">
                {currentImage && (
                  <ImageCarousel images={[currentImage[0]]} interval={2000}/>
                )}
              </div>
            </div>
          </Col>

          {/* Right: scrollable list */}
          <Col sm={11} md={6} lg={8}>
            <div style={{ height: "50vh" }} />
            {events.map((event, idx) => (
              <div
                key={idx}
                ref={(el) => setItemRef(el, idx)}
                className="event-timeline-entity py-3"
                onClick={() => scrollToEvent(idx)}
                style={{ cursor: "pointer" }}
              >
                <div className="event-content">
                  <div className="event-timeline-entity-title">{event.title}</div>
                </div>
                <div className="event-dot" />
              </div>
            ))}
            <div style={{ height: "50vh" }} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EventsPage;
