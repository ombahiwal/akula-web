import React, { useEffect, useState, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button, Spinner, Image, Row, Col} from "react-bootstrap";
import { getContent } from "../api/cfclient";
import "bootstrap/dist/css/bootstrap.min.css";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import '../styles/blogpost.css';
const BlogPost = () => {
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
        <Container className="pt-4 pb-2">
          <Link to="/blog" className="back-link">
            ← Back to Blog
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
                  ← Back to Blog
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
