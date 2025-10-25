import React, {useState, useEffect} from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import Markdown from "react-markdown";
import "bootstrap/dist/css/bootstrap.min.css";
import FlagToText from "./FlagToText";
import {Link} from 'react-router-dom'
import HomeTile from "./HomeTile";
import { getContent } from "../api/cfclient";

const GridLayout = () => {

    const [data, setData] = useState({eventsTimeline:[], blogPosts:[]});
    const [highlights, setHighlights] = useState(null);
     useEffect(() => {
        getContent("info_section").then((data_resp)  => {
                setData(data_resp);
                setHighlights(data_resp['blogPosts'].filter((post) => post.fields.highlight))
                
                window.scrollTo({
                  top: 0,
                  behavior: "smooth", // or "auto"
                });
            });
      }, []);

      function parseDateTime(isoString) {
        const [datePart, timePart] = isoString.split("T");
        const [year, month, day] = datePart.split("-");

        return {
          year,
          month,
          day,
          time: timePart || "00:00", // fallback if no time
          date: day + "." + month + "." + year
        };
      }


  return (
    <div className="d-flex overflow-hidden bg-black">
      <div className="flex-grow-1 p-2 overflow-auto d-flex ">
        <Container>
          <Row className="g-2 justify-content-center">
            <Col xs={12}>
                <Row className="g-2">
                    <Col xs={6} md={3} className="tile-col">
                      <HomeTile
                        frontContent={
                          <Image className="showcase-image" src="/test/music.jpeg" fluid/>
                        }
                        backContent={
                          <div style={{ textAlign: "center" }}>
                            <h2>Music</h2>
                            <p>of ukraine</p>
                          </div>
                        }
                        direction="x"
                      />
                    </Col>
                    <Col xs={6} md={3}>
                         <HomeTile
                        frontContent={
                          <Image className="showcase-image" src="/test/emblem.jpeg" fluid/>
                        }
                        backContent={
                          <div style={{ textAlign: "center" }}>
                            <h2>Emblem</h2>
                            <p>of ukraine</p>
                          </div>
                        }
                        direction="y"
                      />
                      

                    </Col>
                    <Col xs={6} md={3}>
                         <HomeTile
                        frontContent={
                          <Image className="showcase-image" src="/test/plate.jpeg" fluid/>
                        }
                        backContent={
                          <div style={{ textAlign: "center" }}>
                            <h2>Dishes</h2>
                            <p>of ukraine</p>
                          </div>
                        }
                        direction="x"
                      />

                    </Col>
                    <Col xs={6} md={3}>
                        <HomeTile
                        frontContent={
                          <Image className="showcase-image" src="/test/dance.jpeg" fluid/>
                        }
                        backContent={
                          <div style={{ textAlign: "center" }}>
                            <h2>Dances</h2>
                            <p>of ukraine</p>
                          </div>
                        }
                        direction="y"
                      />
                    </Col> 
                </Row>
            </Col>

            {/* Big square 1 */}
            <Col xs={12} md={6}>
                <div className=" ukr-flag-border bg-white text-black d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>
                    <h1>AKULA 
                    </h1>
                </div>
            </Col>

            {/* Big square 2 */}
            <Col xs={12} md={6}>
              <Row className="g-2">
                <Col xs={6}>
                
                   <HomeTile
                        frontContent={
                          <Image className="showcase-image" src="/test/houses.jpeg" fluid/>
                        }
                        backContent={
                          <div style={{ textAlign: "center" }}>
                            <h2>Houses</h2>
                            <p>of ukraine</p>
                          </div>
                        }
                        direction="y"
                      />
                </Col>
                <Col xs={6}>
                  <HomeTile
                        frontContent={
                          <Image className="showcase-image" src="/test/flowers.jpeg" fluid/>
                        }
                        backContent={
                          <div style={{ textAlign: "center" }}>
                            <h2>Flowers</h2>
                            <p>of ukraine</p>
                          </div>
                        }
                        direction="x"
                      />
                </Col>
                <Col xs={6}>
                  <HomeTile
                        frontContent={
                          <Image className="showcase-image" src="/test/patterns.jpeg" fluid/>
                        }
                        backContent={
                          <div style={{ textAlign: "center" }}>
                            <h2>Patterns</h2>
                            <p>of ukraine</p>
                          </div>
                        }
                        direction="x"
                      />
                </Col>
                <Col xs={6}>
                 <HomeTile
                        frontContent={
                          <Image className="showcase-image" src="/test/cat.jpeg" fluid/>
                        }
                        backContent={
                          <div style={{ textAlign: "center" }}>
                            <h2>Cats</h2>
                            <p>of ukraine</p>
                          </div>
                        }
                        direction="y"
                      />
                </Col>
              </Row>
            </Col>

            {/* Big square 3 */}
            <Col xs={12} md={6}>
              <Row className="g-2">
                <Col xs={6}>
                <Link to="/events">
                <div className="square nav-tile position-relative">
                    <span className="top-left">Latest Events</span>
                    <span className="bottom-right">➔</span>
                </div>
                </Link>
                </Col>

                  {data && data['eventsTimeline'].slice(0,3).map((event_post)=>{
                    
                    return(<Col key={event_post.id} xs={6}>
                          <Link to={"/events/"+event_post.id}>
                              <HomeTile
                                    frontContent={
                                      <div className="event-tile" >
                                        <div className="event-tile-bg" style={{backgroundImage:"linear-gradient(rgba(255,255,255,0), rgba(0,0,0,0.4)), url("+event_post.fields.images[0]+")", backgroundSize: "cover"}}></div>
                                        <div className="event-tile-content">
                                          <div>
                                            <h2 className="event-tile-title">{event_post.fields.eventTitle}</h2>
                                            
                                            <small>{parseDateTime(event_post.fields.eventDate).date}</small>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                    backContent={
                                      <div className="event-tile text-black event-tile-desc" >
                                              <Markdown>{event_post.fields.eventDescEn}</Markdown>
                                      </div>
                                    }
                                    direction="y"
                                  />
                            </Link>
                          </Col>)

                  })}

              </Row>
            </Col>

            {/* Big square 4 */}
            <Col xs={12} md={6}>
              <Row className="g-2">
                <Col xs={6}>
                  <Link to={'/blog'}>
                    <div className="square nav-tile position-relative">
                        <span className="top-left">Blog posts</span>
                        <span className="bottom-right">➔</span>
                    </div>
                    </Link>
                </Col>
                   {data && data['blogPosts'].slice(0,3).map((blog_post)=>{
                    
                    return(<Col key={blog_post.id} xs={6}>
                            <Link to={"/blog/"+blog_post.id}>
                                  <HomeTile
                                        frontContent={
                                          
                                          <div className="event-tile" >
                                            <div className="event-tile-bg" style={{backgroundImage:"linear-gradient(rgba(255,255,255,0), rgba(0,0,0,0.5)), url("+blog_post.fields.thumbnail+")", backgroundSize: "cover"}}></div>
                                            <div className="event-tile-content">
                                            <div>
                                                <h2 className="event-tile-title">{blog_post.fields.postTitle}</h2>
                                                <small>{parseDateTime(blog_post.fields.postDateTime).date}</small>
                                            </div>
                                            </div>
                                          </div>
                                        }
                                        backContent={
                                           <div className="event-tile text-black" >
                                            <span className="text-secondary">{blog_post.fields.authors}</span>
                                            <Markdown>{blog_post.fields.shortDescription}</Markdown>
                                          </div>
                                        }
                                        direction="x"
                                      /> 
                            </Link>
                          </Col>
                    )

                  })}
              </Row>
            </Col>

            {/* About Association */}
            <Col xs={12} md={6}>
                <div className=" bg-white text-white d-flex align-items-left justify-content-left" style={{ aspectRatio: "1/1" }}>
                    <div className="about-tile align-items-left">
                        <div className="about-title">
                            About 
                        </div>
                        <div className="about-image">
                            
                        </div>
                        <Container className="about-body kyivserif" fluid >
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

                        </Container>

                    </div>
                </div>
            </Col>

            {/* Team Contact */}
            <Col xs={12} md={6}>
              <Row className="g-2">
                
                
                  {highlights && highlights.slice(0,1).map((blog_post)=>{

                    return(<Col key={blog_post.id} xs={6}>
                            <Link to={"/blog/"+blog_post.id}>
                                  <HomeTile
                                        frontContent={
                                          
                                          <div className="event-tile" >
                                            <div className="event-tile-bg" style={{backgroundImage:"linear-gradient(rgba(255,255,255,0), rgba(0,0,0,0.5)), url("+blog_post.fields.thumbnail+")", backgroundSize: "cover"}}></div>
                                            <div className="event-tile-content">
                                            <div>
                                                <h2 className="event-tile-title">{blog_post.fields.postTitle}</h2>
                                                <small>{parseDateTime(blog_post.fields.postDateTime).date}</small>
                                            </div>
                                            </div>
                                          </div>
                                        }
                                        backContent={
                                           <div className="event-tile text-black" >
                                            <span className="text-secondary">{blog_post.fields.authors}</span>
                                            <Markdown>{blog_post.fields.shortDescription}</Markdown>
                                          </div>
                                        }
                                        direction="y"
                                      /> 
                            </Link>
                          </Col>
                    )

                  })}
                
                <Col xs={6}>
                <Link to="/board">
                  <div className="square nav-tile  position-relative">
                        <span className="top-left">The<br/>AKULA<br/>Board </span>
                        <span className="bottom-right">➔</span>
                    </div>
                </Link>
                </Col>

                  {highlights && highlights.slice(1,2).map((blog_post)=>{

                    return(<Col key={blog_post.id} xs={6}>
                            <Link to={"/blog/"+blog_post.id}>
                                  <HomeTile
                                        frontContent={
                                          
                                          <div className="event-tile" >
                                            <div className="event-tile-bg" style={{backgroundImage:"linear-gradient(rgba(255,255,255,0), rgba(0,0,0,0.5)), url("+blog_post.fields.thumbnail+")", backgroundSize: "cover"}}></div>
                                            <div className="event-tile-content">
                                            <div>
                                                <h2 className="event-tile-title">{blog_post.fields.postTitle}</h2>
                                                <small>{parseDateTime(blog_post.fields.postDateTime).date}</small>
                                            </div>
                                            </div>
                                          </div>
                                        }
                                        backContent={
                                           <div className="event-tile text-black" >
                                            <span className="text-secondary">{blog_post.fields.authors}</span>
                                            <Markdown>{blog_post.fields.shortDescription}</Markdown>
                                          </div>
                                        }
                                        direction="x"
                                      /> 
                            </Link>
                          </Col>
                    )

                  })}
                
                <Col xs={6}>
                <a href="mailto:test@akula.com">
                   <div className="nav-tile nav-tile-highlighted  square position-relative">
                        <span className="top-left">Get in touch</span>
                        {/* <div class="nav-tile-body">Interested in joining us?</div> */}
                        <div className="bottom-right">
                            <span className="small-text-credit">pryvit@akula.com</span>
                        </div>
                    </div>
                    </a>
                </Col>
              </Row>
            </Col>
            

          </Row>
        </Container>
      </div>

    </div>
  );
};

export default GridLayout;
