import React, { useEffect, useState, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button, Spinner, Image } from "react-bootstrap";
import { getContent } from "../api/cfclient";
import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles/blogdetailpage.css";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
const BlogPost = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.log(post)
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

  const { postTitle, postDateTime, thumbnail, blogBody } = blogPost.fields;

  return (
    <div className="bg-white min-vh-100 py-5">
      <Container>
        <Link to="/blogs">
          <Button variant="outline-light" className="mb-4">
            ← Back
          </Button>
        </Link>

        <h1 className="text-warning mb-3">{postTitle}</h1>
        <small className="text-secondary d-block mb-3">{postDateTime}</small>

        {/* Lazy-loaded thumbnail image */}
        <div className="text-center mb-4">
          {/* <Image
            src={thumbnail}
            fluid
            alt={postTitle}
            loading="lazy"
            className="rounded shadow-sm blog-detail-image"
          /> */}
        </div>

        {/* Lazy-loaded content component */}
        <Suspense
          fallback={
            <div className="text-center mt-5">
              <Spinner animation="border" variant="light" />
            </div>
          }
        >
            <div className="blog-body text-light">
            {documentToReactComponents(blogBody, options)}
            </div>
        </Suspense>
      </Container>
    </div>
  );
};

export default BlogPost;
