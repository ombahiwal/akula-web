import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import ornament1Svg from '../assets/design/ornament1.svg';
import ornament2Svg from '../assets/design/ornament2.svg';
import '../styles/ornamentMarquee.css';

const OrnamentMarquee = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const lineRefs = useRef([]);
  const [svgWidth, setSvgWidth] = useState(274);
  const [svgHeight, setSvgHeight] = useState(128);
  const [numberOfRepeats, setNumberOfRepeats] = useState(25);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let resizeObserver = null;
    
    const updateSizing = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      // Wait until container has valid dimensions
      if (containerWidth === 0 || containerHeight === 0) {
        setIsReady(false);
        return;
      }
      
      // Calculate line height: divide container height by 4 exactly
      // This ensures 4 lines fill exactly 100% of the container
      const lineHeight = Math.floor(containerHeight / 4);
      
      // Calculate how many SVGs we want to fit horizontally for a nice pattern
      // Aim for approximately 3-4 SVGs visible at once, but ensure exact fit
      const svgAspectRatio = 274 / 128; // width / height from original SVG
      const idealSvgWidth = lineHeight * svgAspectRatio;
      
      // Calculate how many SVGs would fit with ideal width
      const svgsPerScreen = containerWidth / idealSvgWidth;
      
      // Calculate exact SVG width to ensure perfect tiling
      // Find a width that divides the container width evenly (or with minimal remainder)
      // This ensures SVGs fit perfectly without gaps
      const minSvgCount = Math.max(3, Math.floor(svgsPerScreen));
      const maxSvgCount = Math.ceil(svgsPerScreen * 1.2);
      
      let bestWidth = idealSvgWidth;
      let bestFit = Infinity;
      
      // Try different SVG counts to find the one that fits best
      for (let count = minSvgCount; count <= maxSvgCount; count++) {
        const testWidth = containerWidth / count;
        const difference = Math.abs(testWidth - idealSvgWidth);
        
        if (difference < bestFit) {
          bestFit = difference;
          bestWidth = testWidth;
        }
      }
      
      // Use integer pixel width for exact fitting
      setSvgWidth(Math.floor(bestWidth));
      setSvgHeight(lineHeight);
      setContainerHeight(containerHeight);
      setIsReady(true);
    };

    // Initial sizing with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      updateSizing();
      
      // Use ResizeObserver for better dimension tracking after initial sizing
      if (containerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          updateSizing();
        });
        resizeObserver.observe(containerRef.current);
      }
    }, 100);

    window.addEventListener('resize', updateSizing);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateSizing);
      if (resizeObserver && containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !svgWidth || !isReady) return;

    const lines = lineRefs.current;
    const containerWidth = containerRef.current.offsetWidth;
    
    // Only proceed if we have valid dimensions
    if (containerWidth === 0 || svgWidth === 0) return;
    
    // Calculate how many SVGs we need to cover the width plus extra for seamless loop
    // Ensure we use an exact multiple to prevent gaps
    const baseSvgs = Math.ceil(containerWidth / svgWidth);
    const svgsNeeded = baseSvgs + 3; // Add extra for seamless loop
    // Round up to nearest 2 to ensure even distribution
    const repeats = Math.max(Math.ceil(svgsNeeded / 2) * 2, 16);
    setNumberOfRepeats(repeats);

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      // Create GSAP animations for each line
      lines.forEach((line, index) => {
        if (!line) return;

        const isEven = index % 2 === 0;
        
        // Calculate total width for seamless loop using the calculated repeats value
        const totalWidth = svgWidth * repeats;
        
        // Even indices (0, 2): move left (negative direction)
        // Odd indices (1, 3): move right (positive direction)
        const startX = isEven ? 0 : -totalWidth + containerWidth;
        const endX = isEven ? -totalWidth + containerWidth : 0;
        
        // Kill any existing animations
        gsap.killTweensOf(line);
        
        // Set initial position
        gsap.set(line, {
          x: startX
        });

        // Create infinite animation
        gsap.to(line, {
          x: endX,
          duration: 150 + (index * 4), // Slightly different speeds for each line
          ease: 'none',
          repeat: -1
        });
      });
    }, 50);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      lines.forEach((line) => {
        if (line) {
          gsap.killTweensOf(line);
        }
      });
    };
  }, [svgWidth, isReady]);

  const numberOfLines = 4;

  return (
    <div ref={containerRef} className="ornament-marquee-container">
      {/* Text mask overlay - used to mask the marquee */}
      <div className="akula-text-mask">
        <div className="akula-title">AKULA</div>
        <div className="akula-subtitle">{t('home.subtitle')}</div>
      </div>
      {Array.from({ length: numberOfLines }).map((_, index) => {
        // Calculate exact positions to ensure lines fill containerHeight completely with no gaps
        // Recalculate lineHeight from containerHeight to ensure consistency
        const totalHeight = containerHeight > 0 ? Math.floor(containerHeight) : 0;
        const baseLineHeight = svgHeight; // This should be Math.floor(containerHeight / 4)
        
        // Calculate cumulative top position - each line starts exactly where previous ends
        const topPosition = index * baseLineHeight;
        
        // Calculate exact height for this line
        let exactLineHeight;
        if (index === numberOfLines - 1) {
          // Last line: fill all remaining space exactly to ensure complete coverage
          exactLineHeight = totalHeight - topPosition;
          // Ensure it's at least baseLineHeight (should be, but safety check)
          if (exactLineHeight < baseLineHeight) {
            exactLineHeight = baseLineHeight;
          }
        } else {
          // First 3 lines: use exact baseLineHeight
          exactLineHeight = baseLineHeight;
        }
        
        // Ensure we have valid dimensions
        if (totalHeight === 0 || exactLineHeight <= 0) {
          return null;
        }
        
        // Use exact integer values - no rounding to prevent gaps
        const exactTop = topPosition;
        const exactHeight = exactLineHeight;
        
        return (
          <div
            key={index}
            ref={(el) => (lineRefs.current[index] = el)}
            className="ornament-marquee-line"
            style={{
              top: `${exactTop}px`,
              height: `${exactHeight}px`
            }}
          >
            {Array.from({ length: numberOfRepeats }).map((_, svgIndex) => {
              // Recalculate SVG width based on the actual line height to ensure perfect fit
              // SVG aspect ratio: 274 / 128 = 2.140625
              const svgAspectRatio = 274 / 128;
              const exactHeight = Math.floor(exactLineHeight);
              // Calculate width to maintain aspect ratio and fill the line div completely
              const exactWidth = Math.floor(exactHeight * svgAspectRatio);
              
              return (
                <img
                  key={svgIndex}
                  src={index < 2 ? ornament1Svg : ornament2Svg}
                  alt=""
                  className="ornament-svg"
                  style={{
                    width: `${exactWidth}px`,
                    height: `${exactHeight}px`,
                    minWidth: `${exactWidth}px`,
                    maxWidth: `${exactWidth}px`,
                    minHeight: `${exactHeight}px`,
                    maxHeight: `${exactHeight}px`,
                    objectFit: 'fill',
                    objectPosition: 'top left',
                    display: 'block',
                    margin: 0,
                    padding: 0,
                    border: 'none',
                    outline: 'none',
                    flexShrink: 0,
                    flexGrow: 0
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default OrnamentMarquee;

