import React, { useEffect, useState, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button, Spinner, Image, Row, Col} from "react-bootstrap";
import { getContent } from "../api/cfclient";
import "bootstrap/dist/css/bootstrap.min.css";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import '../styles/eventpost.css';
import ImageCarousel from "../components/ImageCarousel";
import Markdown from "react-markdown";
const EventPost = () => {
  const { id } = useParams();
  const [eventPost, setEventPost] = useState(null);
  const [loading, setLoading] = useState(true);


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
        md: month + "." + day,
        date:   day + "." + month + "." + year
      };
    }


  const options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
    },
    renderNode: {
      [BLOCKS.HEADING_1]: (node, children) => <h1>{children}</h1>,
      [BLOCKS.HEADING_2]: (node, children) => <h2>{children}</h2>,
      [BLOCKS.HEADING_3]: (node, children) => <h3>{children}</h3>,
      [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
      [BLOCKS.UL_LIST]: (node, children) => <ul>{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol>{children}</ol>,
      [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
      [BLOCKS.EMBEDDED_ASSET]: (node) => (
        <Image
          src={node.data.target}
          fluid
          className="my-3 rounded shadow-sm"
        />
      ),
      [INLINES.HYPERLINK]: (node, children) => (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
    },
  };

  useEffect(() => {
    getContent("info_section").then((data_resp) => {
      const post = data_resp["eventsTimeline"].find(
        (item) => String(item.id) === String(id)
      );
      
      setEventPost(post || null);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [id]);

  if (loading) {
    return (
      <div className="bg-black min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  if (!eventPost) {
    return (
      <Container className="text-center mt-5">
        <h2>Event not found</h2>
        <Link to="/Event">
          <Button variant="warning" className="mt-3">
            Back to Events
          </Button>
        </Link>
      </Container>
    );
  }

  const { eventDate, eventDescEn, eventTitle, eventArticle, images } = eventPost.fields;

  return (
    <div className="d-flex overflow-hidden">
      <div className="flex-grow-1 p-2 overflow-auto d-flex  bg-white">
        <Container fluid>
            <Row className="g-2 event-gallery">
                {images.map((imgs, idx)=>{
                    return(
                      <Col key={idx} xs={12} sm={6} md={4} lg={4}>
                        <Image src={imgs} fluid/>
                    </Col>)
                })}
            </Row>
          <Row className="g-2">
                
              <Col xs={12} className="align-content-center">
              <div className="post-heading">
                <h1 className="post-title">{eventTitle}</h1>
                <h6 className="text-secondary d-block mb-3">{parseDateTime(eventDate).date}</h6>
              </div>
              <div className="event-body">
                {eventArticle ? documentToReactComponents(eventArticle, options) : <Markdown>{eventDescEn}</Markdown>}
              </div>
            </Col>
             <Col>
              <div className="event-card-heading">
                  AKULA Events
                      {/* <h2 className="mb-3"></h2> */}
                  </div>
            </Col>
            </Row>
      </Container>
    </div>
    </div>
  );
};

export default EventPost;
