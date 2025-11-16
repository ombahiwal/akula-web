import React, { useEffect, useState, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button, Spinner, Image, Row, Col} from "react-bootstrap";
import { getContent } from "../api/cfclient";
import "bootstrap/dist/css/bootstrap.min.css";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { useTranslation } from 'react-i18next';
import '../styles/blogpost.css';
const BlogPost = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);


  function parseDateTime(isoString) {
      const [datePart, timePart] = isoString.split("T");
      const [year, month, day] = datePart.split("-");

      return {
        year,
        month,
        day,
        time: timePart || "00:00", // fallback if no time
        md: month + "." + day,
        date:  month + "." + day + "." + year
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
        <blockquote className="blog-blockquote">
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
            <div className="blog-embedded-entry blog-embedded-blog">
              {fields.postTitle && (
                <h4 className="blog-embedded-title">
                  <Link to={`/blog/${entry.sys.id}`}>
                    {fields.postTitle}
                  </Link>
                </h4>
              )}
              {fields.shortDescription && (
                <p className="blog-embedded-description">{fields.shortDescription}</p>
              )}
            </div>
          );
        }
        
        if (contentType === 'event' || contentType === 'eventsTimeline') {
          return (
            <div className="blog-embedded-entry blog-embedded-event">
              {fields.eventTitle && (
                <h4 className="blog-embedded-title">
                  <Link to={`/events/${entry.sys.id}`}>
                    {fields.eventTitle}
                  </Link>
                </h4>
              )}
              {fields.eventDescEn && (
                <p className="blog-embedded-description">{fields.eventDescEn}</p>
              )}
            </div>
          );
        }
        
        // Generic fallback for other entry types
        return (
          <div className="blog-embedded-entry">
            <p className="blog-embedded-fallback">
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
            <Link to={`/blog/${entryId}`} className="blog-entry-link">
              {children}
            </Link>
          );
        }
        
        if (contentType === 'event' || contentType === 'eventsTimeline') {
          return (
            <Link to={`/events/${entryId}`} className="blog-entry-link">
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
      const post = data_resp["blogPosts"].find(
        (item) => String(item.id) === String(id)
      );
      
      setBlogPost(post || null);
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

  if (!blogPost) {
    return (
      <Container className="text-center mt-5">
        <h2>Blog not found</h2>
        <Link to="/blog">
          <Button variant="warning" className="mt-3">
            Back to Blogs
          </Button>
        </Link>
      </Container>
    );
  }

  const { postTitle, postDateTime, authors, blogBody, thumbnail } = blogPost.fields;

  return (
    <div className="d-flex overflow-hidden bg-black">
      <div className="flex-grow-1 overflow-auto bg-white">
        {/* Back Button */}
        <title>Hello</title>
        <Container className="pt-4 pb-2">
          <Link to="/blog" className="back-link">
            {t('blog.backToBlog')}
          </Link>
        </Container>

        {/* Hero Image */}
        {thumbnail && (
          <div className="blog-hero-image">
            <Image src={thumbnail} fluid className="w-100" />
          </div>
        )}

        <Container>
          <Row className="justify-content-center">
            {/* Main Content */}
            <Col xs={12} lg={8} xl={7}>
              {/* Post Header */}
              <div className="post-header">
                <h1 className="post-title">{postTitle}</h1>
                <div className="post-meta">
                  <span className="post-author">{authors}</span>
                  <span className="post-separator">•</span>
                  <span className="post-date">{parseDateTime(postDateTime).date}</span>
                </div>
              </div>

              {/* Blog Body */}
              <div className="blog-body">
              {documentToReactComponents(blogBody, options)}
              </div>

              {/* Footer */}
              <div className="post-footer">
                <Link to="/blog" className="back-link-footer">
                  {t('blog.backToBlog')}
                </Link>
                  </div>
            </Col>
            </Row>
      </Container>
    </div>
    </div>
  );
};

export default BlogPost;
