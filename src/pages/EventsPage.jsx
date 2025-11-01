import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { getContent } from "../api/cfclient";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Eventpage.css";
import ImageCarousel from "../components/ImageCarousel";
import {Link} from 'react-router-dom';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function parseDateTime(isoString) {
   if(!isoString)
        return ""
  const [datePart, timePart] = isoString.split("T");
  const [year, month, day] = datePart.split("-");

  return {
    year,
    month,
    day,
    time: timePart || "00:00", // fallback if no time
    md: month + "." + day
  };
}

const EventsPage = () => {
  const [events, setEvents] = useState([]); // fetched events
  const [currentYear, setCurrentYear] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [currentMD, setCurrentMD] = useState("");
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  itemsRef.current = itemsRef.current || [];

  const setItemRef = (el, idx) => {
    itemsRef.current[idx] = el;
  };

  // Fetch events from API
  useEffect(() => {
  getContent("info_section").then((data_resp) => {
    
    // Ensure data_resp.items exists and is an array
    const fetchedEvents = data_resp['eventsTimeline'].map((item) => {
      const dt = parseDateTime(item.fields?.eventDate);
      return {
          dt: dt,
          year: dt.year || "",
          month: dt.month || "",
          day: dt.day || "",
          title: item.fields?.eventTitle || "",
          id: item.id || "",
          image: item.fields?.images || "https://placehold.co/400x300?text=no-image",
          dateString: item.fields?.eventDate || "", // Keep original date string for sorting
        };
    });

    // Sort events by date (descending - newest first)
    fetchedEvents.sort((a, b) => {
      if (!a.dateString || !b.dateString) return 0;
      return new Date(b.dateString) - new Date(a.dateString);
    });

    setEvents(fetchedEvents);

    if (fetchedEvents.length > 0) {
      setCurrentYear(fetchedEvents[0].year);
      setCurrentMD(fetchedEvents[0].dt.md);
      setCurrentImage(fetchedEvents[0].image);
    }
  }).catch((err) => {
    console.error("Failed to fetch events:", err);
  });
}, []);


  // Initialize GSAP ScrollTriggers **after events are loaded**
  useEffect(() => {
    if (!events.length || !containerRef.current) return;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      ScrollTrigger.getAll().forEach((t) => t.kill());

      const highlightItemInTrigger = (index) => {
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

      // Determine if mobile or desktop based on container class
      const isMobile = containerRef.current.classList.contains('mobile-events-timeline');
      const scroller = isMobile ? containerRef.current : (containerRef.current || window);

      const updateCurrentEvent = (index) => {
        if (index >= 0 && index < events.length) {
          setCurrentYear(events[index].year);
          setCurrentMD(events[index].dt.md);
          setCurrentImage(events[index].image);
          highlightItemInTrigger(index);
        }
      };

      // Create ScrollTriggers
      const triggers = itemsRef.current.map((el, i) => {
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          scroller: scroller,
          start: isMobile ? "top 70%" : "top center",
          end: isMobile ? "bottom 30%" : "bottom center",
          onEnter: () => updateCurrentEvent(i),
          onEnterBack: () => updateCurrentEvent(i),
        });
      });

      // Manual scroll listener for mobile (fallback if ScrollTrigger doesn't work well)
      let scrollTimeout;
      let scrollCleanup = null;

      if (isMobile && scroller) {
        const handleScroll = () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            const scrollTop = scroller.scrollTop;
            const containerHeight = scroller.clientHeight;
            const viewportCenter = scrollTop + (containerHeight * 0.5);

            // Find which event is closest to the center of viewport
            let closestIndex = 0;
            let closestDistance = Infinity;

            itemsRef.current.forEach((item, i) => {
              if (!item) return;
              const itemTop = item.offsetTop;
              const itemHeight = item.offsetHeight;
              const itemCenter = itemTop + (itemHeight / 2);
              const distance = Math.abs(viewportCenter - itemCenter);

              if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
              }
            });

            updateCurrentEvent(closestIndex);
          }, 50);
        };

        scroller.addEventListener('scroll', handleScroll, { passive: true });
        
        scrollCleanup = () => {
          scroller.removeEventListener('scroll', handleScroll);
          clearTimeout(scrollTimeout);
        };
      }

      ScrollTrigger.refresh();
      updateCurrentEvent(0);

      // Return cleanup function
      return () => {
        if (scrollCleanup) scrollCleanup();
        triggers.forEach((t) => t && t.kill && t.kill());
      };
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [events]); // run effect whenever events change

  // Refresh ScrollTrigger on window resize to handle mobile/desktop switch
  useEffect(() => {
    const handleResize = () => {
      if (events.length && containerRef.current) {
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [events.length]);

  // Scroll to specific event
  const scrollToEvent = (index) => {
    if (!itemsRef.current[index] || !containerRef.current) return;
    const el = itemsRef.current[index];
    const isMobile = containerRef.current.classList.contains('mobile-events-timeline');
    
    if (isMobile) {
      // For mobile, scroll within the timeline container
      const container = containerRef.current;
      const containerTop = container.scrollTop;
      const elementTop = el.offsetTop;
      const targetScroll = containerTop + elementTop - (container.clientHeight * 0.3);

      gsap.to(container, {
        duration: 0.8,
        ease: "power2.out",
        scrollTo: { y: targetScroll, autoKill: true },
        onComplete: () => {
          setCurrentYear(events[index].year);
          setCurrentMD(events[index].dt.md);
          setCurrentImage(events[index].image);
          highlightItem(index);
        },
      });
    } else {
      // For desktop
      const top = el.offsetTop - window.innerHeight / 2;

      gsap.to(containerRef.current, {
        duration: 0.8,
        ease: "power2.out",
        scrollTo: { y: top, autoKill: true },
        onComplete: () => {
          setCurrentYear(events[index].year);
          setCurrentMD(events[index].dt.md);
          setCurrentImage(events[index].image);
          highlightItem(index);
        },
      });
    }
  };

  const highlightItem = (index) => {
    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      const titleEl = item.querySelector(".event-timeline-entity-title");
      if (titleEl) {
        gsap.to(titleEl, {
          color: i === index ? "#ffd700" : "#0057b8",
          scale: i === index ? 1.02 : 1,
          duration: 0.25,
        });
      }
    });
  };

  // Group events by year for timeline
  const eventsByYear = events.reduce((acc, event) => {
    const year = event.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {});

  // Sort events within each year by date (descending - newest first)
  Object.keys(eventsByYear).forEach((year) => {
    eventsByYear[year].sort((a, b) => {
      if (!a.dateString || !b.dateString) return 0;
      return new Date(b.dateString) - new Date(a.dateString);
    });
  });

  const years = Object.keys(eventsByYear).sort((a, b) => b.localeCompare(a)); // Sort years descending

  return (
    <div className="events-page bg-black text-white">
      {/* Mobile Layout - Timeline only */}
      <div className="d-lg-none mobile-events-layout">
        {/* Scrollable Timeline Section */}
        <div ref={containerRef} className="mobile-events-timeline">
          <div className="timeline-wrapper">
            <div className="timeline-line"></div>
            <div style={{ height: "20vh" }} />
            {years.map((year, yearIdx) => (
              <div key={year} className="timeline-year-group">
                {/* Year Marker */}
                <div className="timeline-year-marker">
                  <div className="timeline-year-dot"></div>
                  <div className="timeline-year-label">{year}</div>
                </div>
                
                {/* Events for this year */}
                {eventsByYear[year].map((event, eventIdx) => {
                  const globalIdx = events.findIndex(e => e.id === event.id);
                  return (
                    <div
                      key={event.id}
                      ref={(el) => setItemRef(el, globalIdx)}
                      className="event-timeline-entity"
                      onClick={() => scrollToEvent(globalIdx)}
                    >
                      <div className="event-timeline-date-marker">
                        <div className="event-date-dot"></div>
                        <div className="event-date-label">{event.dt.md}</div>
                      </div>
                      <div className="event-content">
                        <Link to={"/events/"+event.id}>
                          <div className="event-timeline-entity-title">{event.title}</div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div style={{ height: "20vh" }} />
          </div>
        </div>
      </div>

      {/* Desktop Layout - Side by side */}
      <Container fluid className="h-100 py-5 d-none d-lg-block">
        <Row ref={containerRef} className="events-list-container">
          {/* Left sticky column - Desktop */}
          <Col xs={12} md={12} lg={4}>
            <div className="sticky-col event-fixed">
              <div className="event-current-year">
                <small className="event-current-md">{currentMD}</small>.{currentYear}
              </div>
              <div className="event-current-image">
                {currentImage && (
                  <ImageCarousel images={Array.isArray(currentImage) ? [currentImage[0]] : [currentImage]} interval={3000}/>
                )}
              </div>
            </div>
          </Col>

          {/* Right: scrollable timeline list */}
          <Col xs={12} lg={8}>
            <div className="timeline-wrapper">
              <div className="timeline-line"></div>
              <div style={{ height: "50vh" }} />
              {years.map((year, yearIdx) => (
                <div key={year} className="timeline-year-group">
                  {/* Year Marker */}
                  <div className="timeline-year-marker">
                    <div className="timeline-year-dot"></div>
                    <div className="timeline-year-label">{year}</div>
                  </div>
                  
                  {/* Events for this year */}
                  {eventsByYear[year].map((event, eventIdx) => {
                    const globalIdx = events.findIndex(e => e.id === event.id);
                    return (
                      <div
                        key={event.id}
                        ref={(el) => setItemRef(el, globalIdx)}
                        className="event-timeline-entity"
                        onClick={() => scrollToEvent(globalIdx)}
                      >
                        <div className="event-timeline-date-marker">
                          <div className="event-date-dot"></div>
                          <div className="event-date-label">{event.dt.md}</div>
                        </div>
                        <div className="event-content">
                          <Link to={"/events/"+event.id}>
                            <div className="event-timeline-entity-title">{event.title}</div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div style={{ height: "50vh" }} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EventsPage;
