import React, { useEffect, useState, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button, Spinner, Image, Row, Col} from "react-bootstrap";
import { getContent } from "../api/cfclient";
import "bootstrap/dist/css/bootstrap.min.css";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { useTranslation } from 'react-i18next';
import '../styles/eventpost.css';
import ImageCarousel from "../components/ImageCarousel";
import Markdown from "react-markdown";
const EventPost = () => {
  const { t } = useTranslation();
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
      [BLOCKS.QUOTE]: (node, children) => (
        <blockquote className="event-blockquote">
          {children}
        </blockquote>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const asset = node.data.target;
        let imageUrl = null;
        let altText = '';
        
        // Handle asset object structure
        if (asset?.fields?.file?.url) {
          imageUrl = `https:${asset.fields.file.url}`;
          altText = asset.fields.title || asset.fields.description || '';
        } 
        // Fallback: handle if target is already a URL string
        else if (typeof asset === 'string') {
          imageUrl = asset;
        }
        
        if (imageUrl) {
          return (
            <Image
              src={imageUrl}
              alt={altText}
              fluid
              className="my-3 rounded shadow-sm"
            />
          );
        }
        return null;
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        const entry = node.data.target;
        if (!entry) return null;
        
        const contentType = entry.sys?.contentType?.sys?.id;
        const fields = entry.fields || {};
        
        // Handle different embedded entry types
        if (contentType === 'blogPost' || contentType === 'blogPosts') {
          return (
            <div className="event-embedded-entry event-embedded-blog">
              {fields.postTitle && (
                <h4 className="event-embedded-title">
                  <Link to={`/blog/${entry.sys.id}`}>
                    {fields.postTitle}
                  </Link>
                </h4>
              )}
              {fields.shortDescription && (
                <p className="event-embedded-description">{fields.shortDescription}</p>
              )}
            </div>
          );
        }
        
        if (contentType === 'event' || contentType === 'eventsTimeline') {
          return (
            <div className="event-embedded-entry event-embedded-event">
              {fields.eventTitle && (
                <h4 className="event-embedded-title">
                  <Link to={`/events/${entry.sys.id}`}>
                    {fields.eventTitle}
                  </Link>
                </h4>
              )}
              {fields.eventDescEn && (
                <p className="event-embedded-description">{fields.eventDescEn}</p>
              )}
            </div>
          );
        }
        
        // Generic fallback for other entry types
        return (
          <div className="event-embedded-entry">
            <p className="event-embedded-fallback">
              [Embedded content: {contentType || 'unknown'}]</p>
          </div>
        );
      },
      [INLINES.HYPERLINK]: (node, children) => (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
      [INLINES.ENTRY_HYPERLINK]: (node, children) => {
        const entry = node.data.target;
        if (!entry) return <span>{children}</span>;
        
        const contentType = entry.sys?.contentType?.sys?.id;
        const entryId = entry.sys?.id;
        
        if (contentType === 'blogPost' || contentType === 'blogPosts') {
          return (
            <Link to={`/blog/${entryId}`} className="event-entry-link">
              {children}
            </Link>
          );
        }
        
        if (contentType === 'event' || contentType === 'eventsTimeline') {
          return (
            <Link to={`/events/${entryId}`} className="event-entry-link">
              {children}
            </Link>
          );
        }
        
        return <span>{children}</span>;
      },
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
        <Link to="/events">
          <Button variant="warning" className="mt-3">
            Back to Events
          </Button>
        </Link>
      </Container>
    );
  }

  const { eventDate, eventDescEn, eventTitle, eventArticle, images } = eventPost.fields;

  return (
    <div className="d-flex overflow-hidden bg-black">
      <div className="flex-grow-1 overflow-auto bg-white">
        {/* Back Button */}
        <Container className="pt-4 pb-2">
          <Link to="/events" className="back-link">
            {t('events.backToEvents')}
          </Link>
        </Container>

        {/* Image Gallery Wall */}
        {images && images.length > 0 && (
          <Container fluid className="px-0">
            <Row className="g-2 event-gallery-wall">
              {images.map((img, idx) => (
                <Col key={idx} xs={12} sm={6} md={4} lg={3}>
                  <div className="event-gallery-image-wrapper">
                    <Image src={img} className="event-gallery-wall-image" fluid />
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        )}

        <Container>
          <Row className="justify-content-center">
            {/* Main Content */}
            <Col xs={12} lg={8} xl={7}>
              {/* Event Header */}
              <div className="post-header">
                <h1 className="post-title">{eventTitle}</h1>
                <div className="post-meta">
                  <span className="post-date">{parseDateTime(eventDate).date}</span>
                </div>
              </div>

              {/* Event Body */}
              <div className="event-body">
                {eventArticle ? documentToReactComponents(eventArticle, options) : <Markdown>{eventDescEn}</Markdown>}
              </div>

              {/* Footer */}
              <div className="post-footer">
                <Link to="/events" className="back-link-footer">
                  {t('events.backToEvents')}
                </Link>
                  </div>
            </Col>
            </Row>
      </Container>
    </div>
    </div>
  );
};

export default EventPost;
