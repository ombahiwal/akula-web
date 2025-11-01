import React, {useState, useEffect, useRef} from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import Markdown from "react-markdown";
import "bootstrap/dist/css/bootstrap.min.css";
import FlagToText from "./FlagToText";
import {Link} from 'react-router-dom'
import HomeTile from "./HomeTile";
import { getContent } from "../api/cfclient";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "./LanguageSwitcher";
import "../styles/homepage.css";

const GridLayout = () => {
    const { t } = useTranslation();
    const [data, setData] = useState({eventsTimeline:[], blogPosts:[], homeTiles:[]});
    const [highlights, setHighlights] = useState(null);
    const [homeTiles, setHomeTiles] = useState([]);
     useEffect(() => {
        getContent("info_section").then((data_resp)  => {
                // Sort eventsTimeline by date (descending - newest first)
                const sortedEvents = (data_resp['eventsTimeline'] || []).sort((a, b) => {
                  const dateA = a.fields?.eventDate || "";
                  const dateB = b.fields?.eventDate || "";
                  if (!dateA || !dateB) return 0;
                  return new Date(dateB) - new Date(dateA);
                });

                // Sort blogPosts by date (descending - newest first)
                const sortedBlogPosts = (data_resp['blogPosts'] || []).sort((a, b) => {
                  const dateA = a.fields?.postDateTime || "";
                  const dateB = b.fields?.postDateTime || "";
                  if (!dateA || !dateB) return 0;
                  return new Date(dateB) - new Date(dateA);
                });

                // Update data_resp with sorted arrays
                const updatedData = {
                  ...data_resp,
                  eventsTimeline: sortedEvents,
                  blogPosts: sortedBlogPosts
                };

                setData(updatedData);
                setHighlights(sortedBlogPosts.filter((post) => post.fields.highlight));
                // Get homeTiles and sort by tilePosition
                const tiles = data_resp['homeTiles'] || [];
                const sortedTiles = tiles.sort((a, b) => {
                  const posA = a.fields.tilePosition || 0;
                  const posB = b.fields.tilePosition || 0;
                  return posA - posB;
                });
                setHomeTiles(sortedTiles);
                console.log(sortedTiles);
                console.log(data_resp);
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

      // Rich text renderer options
      const richTextOptions = {
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
          [INLINES.HYPERLINK]: (node, children) => (
            <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        },
      };


  return (
    <div className="d-flex overflow-hidden bg-black">
      <div className="flex-grow-1 overflow-auto d-flex">
        <Container className="homepage-container">
          <Row className="g-2 justify-content-center">
            <Col xs={12}>
                <Row className="g-2">
                  {homeTiles && homeTiles.slice(0,4).map((tile, index) => {
                    const tileData = tile.fields || {};
                    const tileImage = tileData.tileImages && Array.isArray(tileData.tileImages) && tileData.tileImages.length > 0 ? tileData.tileImages[0] : null;
                    const directions = ["x", "y", "x", "y"]; // Alternate pattern
                    const direction = directions[index % 4];
                    const blogLink = tileData.tileBlogId ? `/blog/${tileData.tileBlogId}` : "#";
                    
                    // Safely render rich text content
                    let richTextContent = null;
                    if (tileData.tileContent && 
                        typeof tileData.tileContent === 'object' && 
                        tileData.tileContent.content && 
                        Array.isArray(tileData.tileContent.content)) {
                      try {
                        richTextContent = documentToReactComponents(tileData.tileContent, richTextOptions);
                      } catch (error) {
                        console.error('Error rendering rich text:', error, tileData.tileContent);
                        richTextContent = null;
                      }
                    }
                    
                    // Component to handle dynamic title sizing
                    const TileWithDynamicTitle = ({ tileId, tileData, tileImage, direction, blogLink, richTextContent, isFirst }) => {
                      const tileRef = useRef(null);
                      const titleRef = useRef(null);
                      
                      useEffect(() => {
                        const adjustFontSize = () => {
                          if (tileRef.current && titleRef.current) {
                            // Measure the actual tile width (accounting for borders/padding)
                            const tileWidth = tileRef.current.offsetWidth;
                            // Calculate font size as 10% of tile width, with min/max constraints
                            // Min: 12px, Max: 24px, or 10% of tile width
                            const baseSize = tileWidth * 0.1;
                            const fontSize = Math.max(8, Math.min(20, baseSize));
                            titleRef.current.style.fontSize = `${fontSize}px`;
                          }
                        };
                        
                        // Initial adjustment after a brief delay to ensure DOM is ready
                        const timeoutId = setTimeout(adjustFontSize, 50);
                        
                        const resizeObserver = new ResizeObserver(() => {
                          adjustFontSize();
                        });
                        
                        if (tileRef.current) {
                          resizeObserver.observe(tileRef.current);
                        }
                        
                        window.addEventListener('resize', adjustFontSize);
                        
                        return () => {
                          clearTimeout(timeoutId);
                          resizeObserver.disconnect();
                          window.removeEventListener('resize', adjustFontSize);
                        };
                      }, []);
                      
                      return (
                        <Col xs={6} md={3} className={isFirst ? "tile-col" : ""}>
                          <div ref={tileRef} className="home-tile-wrapper" style={{ width: '100%' }}>
                            <HomeTile
                              frontContent={
                                tileImage ? (
                                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <Image className="showcase-image" src={tileImage} fluid/>
                                  </div>
                                ) : (
                                  <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span>No Image</span>
                                  </div>
                                )
                              }
                              backContent={
                                <div style={{ textAlign: "center", position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem' }}>
                                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden' }}>
                                    <h2 ref={titleRef} className="home-tile-title">{tileData.tileTitle || ""}</h2>
                                    {richTextContent && (
                                      <div className="text-back-small" style={{ overflow: 'hidden' }}>
                                        {richTextContent}
                                      </div>
                                    )}
                                  </div>
                                  <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                    <Link to={blogLink} className="home-tile-arrow-link" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }}>
                                      <span className="home-tile-arrow" style={{ fontSize: '1.5rem', display: 'inline-block' }}>➔</span>
                                    </Link>
                                  </div>
                                </div>
                              }
                              direction={direction}
                            />
                          </div>
                        </Col>
                      );
                    };
                    
                    return (
                      <TileWithDynamicTitle
                        key={tile.id}
                        tileId={tile.id}
                        tileData={tileData}
                        tileImage={tileImage}
                        direction={direction}
                        blogLink={blogLink}
                        richTextContent={richTextContent}
                        isFirst={index === 0}
                      />
                    );
                  })}
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
                {homeTiles && homeTiles.slice(4, 8).map((tile, index) => {
                  const tileData = tile.fields || {};
                  const tileImage = tileData.tileImages && Array.isArray(tileData.tileImages) && tileData.tileImages.length > 0 ? tileData.tileImages[0] : null;
                  const directions = ["y", "x", "x", "y"]; // Match the pattern from static tiles
                  const direction = directions[index % 4];
                  const blogLink = tileData.tileBlogId ? `/blog/${tileData.tileBlogId}` : "#";
                  
                  // Safely render rich text content
                  let richTextContent = null;
                  if (tileData.tileContent && 
                      typeof tileData.tileContent === 'object' && 
                      tileData.tileContent.content && 
                      Array.isArray(tileData.tileContent.content)) {
                    try {
                      richTextContent = documentToReactComponents(tileData.tileContent, richTextOptions);
                    } catch (error) {
                      console.error('Error rendering rich text:', error, tileData.tileContent);
                      richTextContent = null;
                    }
                  }
                  
                  // Component to handle dynamic title sizing for 2x2 grid tiles
                  const TileWithDynamicTitle = ({ tileId, tileData, tileImage, direction, blogLink, richTextContent }) => {
                    const tileRef = useRef(null);
                    const titleRef = useRef(null);
                    
                    useEffect(() => {
                      const adjustFontSize = () => {
                        if (tileRef.current && titleRef.current) {
                          // Measure the actual tile width (accounting for borders/padding)
                          const tileWidth = tileRef.current.offsetWidth;
                          // Calculate font size as 10% of tile width, with min/max constraints
                          const baseSize = tileWidth * 0.1;
                          const fontSize = Math.max(12, Math.min(24, baseSize));
                          titleRef.current.style.fontSize = `${fontSize}px`;
                        }
                      };
                      
                      // Initial adjustment after a brief delay to ensure DOM is ready
                      const timeoutId = setTimeout(adjustFontSize, 50);
                      
                      const resizeObserver = new ResizeObserver(() => {
                        adjustFontSize();
                      });
                      
                      if (tileRef.current) {
                        resizeObserver.observe(tileRef.current);
                      }
                      
                      window.addEventListener('resize', adjustFontSize);
                      
                      return () => {
                        clearTimeout(timeoutId);
                        resizeObserver.disconnect();
                        window.removeEventListener('resize', adjustFontSize);
                      };
                    }, []);
                    
                    return (
                      <Col xs={6}>
                        <div ref={tileRef} className="home-tile-wrapper" style={{ width: '100%' }}>
                          <HomeTile
                            frontContent={
                              tileImage ? (
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                  <Image className="showcase-image" src={tileImage} fluid/>
                                </div>
                              ) : (
                                <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <span>No Image</span>
                                </div>
                              )
                            }
                            backContent={
                              <div style={{ textAlign: "center", position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden' }}>
                                  <h2 ref={titleRef} className="home-tile-title">{tileData.tileTitle || ""}</h2>
                                  {richTextContent && (
                                    <div className="text-back-small" style={{ overflow: 'hidden' }}>
                                      {richTextContent}
                                    </div>
                                  )}
                                </div>
                                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                  <Link to={blogLink} className="home-tile-arrow-link" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }}>
                                    <span className="home-tile-arrow" style={{ fontSize: '1.5rem', display: 'inline-block' }}>➔</span>
                                  </Link>
                                </div>
                              </div>
                            }
                            direction={direction}
                          />
                        </div>
                      </Col>
                    );
                  };
                  
                  return (
                    <TileWithDynamicTitle
                      key={tile.id}
                      tileId={tile.id}
                      tileData={tileData}
                      tileImage={tileImage}
                      direction={direction}
                      blogLink={blogLink}
                      richTextContent={richTextContent}
                    />
                  );
                })}
              </Row>
            </Col>

            {/* Big square 3 */}
            <Col xs={12} md={6}>
              <Row className="g-2">
                <Col xs={6}>
                <Link to="/events">
                <div className="square nav-tile position-relative">
                    <span className="top-left">{t('nav.latestEvents')}</span>
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
                                            
                                            <small>{event_post.fields.eventDate && parseDateTime(event_post.fields.eventDate).date}</small>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                    backContent={
                                      <div className="event-tile text-black event-tile-desc" >
                                              <span className="text-back-small"><Markdown>{event_post.fields.eventDescEn}</Markdown></span>
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
                        <span className="top-left">{t('nav.blogPosts')}</span>
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
                                                <small>{blog_post.fields.postDateTime && parseDateTime(blog_post.fields.postDateTime).date}</small>
                                            </div>
                                            </div>
                                          </div>
                                        }
                                        backContent={
                                           <div className="event-tile text-black" >
                                            <span className="text-secondary">{blog_post.fields.authors}</span>
                                            <span className="text-back-small"><Markdown>{blog_post.fields.shortDescription}</Markdown></span>
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
                <div className="about-tile bg-white text-black d-flex flex-column" style={{ aspectRatio: "1/1" }}>
                    <div className="about-title">
                        {t('home.about')}
                    </div>
                    <div className="about-body kyivserif">
                        {t('home.aboutText')}
                    </div>
                    <div className="about-language-switcher">
                        <LanguageSwitcher />
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
                                                <small>{blog_post.fields.postDateTime && parseDateTime(blog_post.fields.postDateTime).date}</small>
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
                        <span className="top-left">
                          {t('nav.boardLine1')}
                          <br/>{t('nav.boardLine2')}
                          {t('nav.boardLine3') && <><br/>{t('nav.boardLine3')}</>}
                        </span>
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
                                                <small>{blog_post.fields.postDateTime && parseDateTime(blog_post.fields.postDateTime).date}</small>
                                            </div>
                                            </div>
                                          </div>
                                        }
                                        backContent={
                                           <div className="event-tile text-black" >
                                            <span className="text-secondary">{blog_post.fields.authors}</span>
                                            <span className="text-back-small"><Markdown>{blog_post.fields.shortDescription}</Markdown></span>
                                          </div>
                                        }
                                        direction="x"
                                      /> 
                            </Link>
                          </Col>
                    )

                  })}
                
                <Col xs={6}>
                <div className="nav-tile nav-tile-highlighted square position-relative contact-tile">
                        <span className="top-left">{t('nav.getInTouch')}</span>
                        <div className="bottom-right contact-info">
                            <div className="contact-email">
                                <a href="mailto:akula@epfl.ch" className="contact-link">akula@epfl.ch</a>
                            </div>
                            <div className="social-links">
                                <a href="https://www.instagram.com/akula_epfl" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>
                                <a href="https://www.facebook.com/akulaepfl" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a href="https://www.linkedin.com/company/akula-epfl" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.789-1.75-1.764s.784-1.764 1.75-1.764 1.75.789 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
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
