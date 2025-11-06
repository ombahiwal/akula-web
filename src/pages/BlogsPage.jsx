import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { getContent } from "../api/cfclient";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/blogspage.css";
import {Link} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [blogPosts, setPosts] = useState([]);

  const [search, setSearch] = useState("");
  const filteredPosts = blogPosts.filter((post) =>
    post.fields.postTitle.toLowerCase().includes(search.toLowerCase())
  );

     useEffect(() => {
        getContent("info_section").then((data_resp)  => {
                // Sort blogPosts by date (descending - newest first)
                const sortedBlogPosts = (data_resp['blogPosts'] || []).sort((a, b) => {
                  const dateA = a.fields?.postDateTime || "";
                  const dateB = b.fields?.postDateTime || "";
                  if (!dateA || !dateB) return 0;
                  return new Date(dateB) - new Date(dateA);
                });

                setPosts(sortedBlogPosts);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth", // or "auto"
                });
            });
      }, []);

  return (
    <div className="d-flex overflow-hidden bg-black min-vh-100">
      <div className="bg-white flex-grow-1 overflow-auto">
        <Container fluid className="px-md-5">
          {/* Navigation to Home */}
          <div className="blogs-navigation">
            <Link to="/" className="blogs-home-link">
              {t('blog.backToHome')}
            </Link>
          </div>
          {/* Header Section */}
          <div className="blogs-header">
            <Row className="align-items-center">
              <Col xs={12} md={8}>
                <h1 className="blogs-page-title">{t('blog.title')}</h1>
                <p className="blogs-page-subtitle">
                  {t('blog.subtitle')}
                </p>
              </Col>
              <Col xs={12} md={4}>
              <Form.Control
                type="text"
                  placeholder={t('blog.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                  className="search-bar"
              />
            </Col>
          </Row>
          </div>

          {/* Blog Posts Grid */}
          {blogPosts && (
            <>
            {filteredPosts.length > 0 ? (
                <Row className="g-4 mb-5">
                  {filteredPosts.map((post) => (
                    <Col key={post.id} xs={12} md={6} lg={4}>
                      <Link to={"/blog/"+post.id} className="blog-card-link">
                        <div className="blog-card">
                          <div className="blog-card-image-wrapper">
                            <Image 
                              src={post.fields.thumbnail} 
                              className="blog-card-image"
                              fluid
                            />
                            <div className="blog-card-overlay"></div>
                          </div>
                          <div className="blog-card-content">
                            <div className="blog-card-meta">
                              <span className="blog-card-author">{post.fields.authors}</span>
                              <span className="blog-card-separator">•</span>
                              <span className="blog-card-date">{parseDateTime(post.fields.postDateTime).date}</span>
                    </div>
                            <h3 className="blog-card-title">{post.fields.postTitle}</h3>
                            {post.fields.shortDescription && (
                              <p className="blog-card-description">{post.fields.shortDescription}</p>
                            )}
                    </div>
                  </div>
                      </Link>
                </Col>
                  ))}
                </Row>
            ) : (
                <div className="blogs-empty-state">
                  <p className="blogs-empty-text">{t('blog.noResults')}</p>
                  <p className="blogs-empty-subtext">{t('blog.noResultsSubtext')}</p>
                </div>
            )}
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default BlogsPage;
