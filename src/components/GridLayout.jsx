import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import FlagToText from "./FlagToText";
import {Link} from 'react-router-dom'
const GridLayout = () => {
  return (
    <div className="d-flex overflow-hidden bg-black">
      <div className="flex-grow-1 p-2 overflow-auto d-flex ">
        <Container>
          <Row className="g-2 justify-content-center">
            <Col xs={12}>
                <Row className="g-2">
                    <Col xs={6} md={3}>
                        <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>
                            Hello
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>
                            Hello
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>
                            Hello
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>
                           Hello
                        </div>
                    </Col> 
                </Row>
            </Col>

            {/* Big square 1 */}
            <Col xs={12} md={6}>
                <div className="kyivserif bg-white text-black d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>
                    AKULA
                </div>
            </Col>

            {/* Big square 2 */}
            <Col xs={12} md={6}>
              <Row className="g-2">
                <Col xs={6}>
                  <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>5</div>
                </Col>
                <Col xs={6}>
                  <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>6</div>
                </Col>
                <Col xs={6}>
                  <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>7</div>
                </Col>
                <Col xs={6}>
                  <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>8</div>
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
                <Col xs={6}>
                  <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>10</div>
                </Col>
                <Col xs={6}>
                  <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>11</div>
                </Col>
                <Col xs={6}>
                  <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>

                  </div>
                </Col>
              </Row>
            </Col>

            {/* Big square 4 */}
            <Col xs={12} md={6}>
              <Row className="g-2">
                <Col xs={6}>
                    <div className="square nav-tile position-relative">
                        <span className="top-left">Blog posts</span>
                        <span className="bottom-right">➔</span>
                    </div>
                </Col>
                <Col xs={6}>
                  <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>14</div>
                </Col>
                <Col xs={6}>
                  <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>15</div>
                </Col>
                <Col xs={6}>
                  <div className="bg-white text-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>16</div>
                </Col>
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
                
                <Col xs={6}>
                  <div className="bg-white  d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>
                  Highlight 1 
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="square nav-tile  position-relative">
                        <span className="top-left">The<br/>AKULA<br/>Team </span>
                        <span className="bottom-right">➔</span>
                    </div>
                </Col>
                <Col xs={6}>
                  <div className="bg-white e d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1" }}>
                    Highlight 2 (useful links)
                  </div>
                </Col>
                
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
