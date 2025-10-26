import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { getContent } from "../api/cfclient";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/blogspage.css";
import {Link} from 'react-router-dom';

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

const BlogsPage = () => {
  const [blogPosts, setPosts] = useState([]);

  const [search, setSearch] = useState("");
  const filteredPosts = blogPosts.filter((post) =>
    post.fields.postTitle.toLowerCase().includes(search.toLowerCase())
  );

     useEffect(() => {
        getContent("info_section").then((data_resp)  => {

                setPosts(data_resp['blogPosts']);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth", // or "auto"
                });
            });
      }, []);

  return (
    <div className="d-flex overflow-hidden bg-black min-vh-100 text-white">
      <div className="bg-white flex-grow-1 p-3 overflow-auto d-flex flex-column">
        {blogPosts && <Container>
          {/* Search Bar */}
          <Row className="mb-4 justify-content-center">
            <Col> 
            <div className="blog-card-heading">
                AKULA Blog
                    {/* <h2 className="mb-3"></h2> */}
                </div></Col>
            <Col xs={12} md={6}>
              <Form.Control
                type="text"
                placeholder="Search blog posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 search-bar"
              />
            </Col>
          </Row>

          {/* Blog Grid */}
          <Row className="g-3 justify-content-center">
            <Col>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Row key={post.id} className="m-2 justify-content-center">
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className="tile-col"
                >   
                    <div className="p-3 h-100 bg-white d-flex flex-column justify-content-between  ">
                        <Image src={post.fields.thumbnail} fluid/>
                    </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  className="tile-col"
                >
                  <div className="p-3 h-100 bg-white d-flex flex-column justify-content-between  blog-post-tile">
                    <div> 
                        <h3 className="mb-2"><Link className="blog-link-title" to={"/blog/"+post.id}>{post.fields.postTitle}</Link></h3>
                        <small className="authors">{post.fields.authors}</small> <br/>
                        <small>{post.fields.shortDescription}</small>
                    </div>
                    <small className="text-secondary">{parseDateTime(post.fields.postDateTime).date}</small>
                  </div>
                </Col>
                </Row>
              ))
            ) : (
              <Col xs={12} className="text-center text-muted">
                No blog posts found.
              </Col>
            )}
            </Col>
          </Row>
        </Container>}
      </div>
    </div>
  );
};

export default BlogsPage;
