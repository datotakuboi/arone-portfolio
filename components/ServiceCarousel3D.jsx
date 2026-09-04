import { useCallback, useEffect, useRef, useState, startTransition } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import ProjectImage from './ProjectImage';
import './service-carousel.css';

const spring = { stiffness: 300, damping: 30, mass: 1.2 };

export default function ServiceCarousel3D({ cards, backgroundBlur = 0 }) {
  const [activeIndex, setActiveIndex] = useState(() => Math.floor(cards.length / 2));
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const cardCount = cards.length;

  const goToCard = useCallback((index) => {
    const nextIndex = (index + cardCount) % cardCount;
    startTransition(() => setActiveIndex(nextIndex));
  }, [cardCount]);

  const handlePrevious = useCallback(() => goToCard(activeIndex - 1), [activeIndex, goToCard]);
  const handleNext = useCallback(() => goToCard(activeIndex + 1), [activeIndex, goToCard]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowLeft') handlePrevious();
      if (event.key === 'ArrowRight') handleNext();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    function handleWheel(event) {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (event.deltaX > 20) handleNext();
      if (event.deltaX < -20) handlePrevious();
    }
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleNext, handlePrevious]);

  return (
    <div ref={containerRef} className="immersive-carousel" style={{ '--background-blur': `${backgroundBlur}px` }}>
      <div className="immersive-carousel-stage">
        <div className="immersive-carousel-track">
          {cards.map((card, index) => {
            const position = getCircularPosition(index, activeIndex, cardCount);
            const distance = Math.abs(position);
            const isVisible = distance <= 2;
            const cardStyle = getCardStyle(distance, position, isVisible);
            const isActive = index === activeIndex;
            return (
              <motion.article
                key={card.title}
                className={`immersive-carousel-card${isActive ? ' is-active' : ''}`}
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-label={`${card.title}${isActive ? ' - Active project' : ' - View project'}`}
                aria-hidden={!isVisible}
                animate={cardStyle}
                transition={{ type: 'spring', ...spring }}
                onClick={() => { if (!isActive && !isDragging) goToCard(index); }}
                onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !isActive) { event.preventDefault(); goToCard(index); } }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info) => { setIsDragging(false); if (info.offset.x > 80) handlePrevious(); if (info.offset.x < -80) handleNext(); }}
                drag={isActive ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                style={{ filter: isActive ? 'none' : `blur(${Math.min(distance * backgroundBlur, 0)}px)` }}
              >
                <ProjectCard card={card} active={isActive} eager={index === activeIndex} />
              </motion.article>
            );
          })}
        </div>
        <button type="button" className="immersive-carousel-arrow left" onClick={handlePrevious} disabled={cardCount <= 1} aria-label="Previous featured project"><ArrowLeft size={20} /></button>
        <button type="button" className="immersive-carousel-arrow right" onClick={handleNext} disabled={cardCount <= 1} aria-label="Next featured project"><ArrowRight size={20} /></button>
      </div>
      <div className="immersive-carousel-dots" role="tablist" aria-label="Choose featured project">
        {cards.map((card, index) => <button type="button" role="tab" key={card.title} className={index === activeIndex ? 'is-active' : ''} onClick={() => goToCard(index)} aria-label={`Show ${card.title}`} aria-selected={index === activeIndex} />)}
      </div>
    </div>
  );
}

function getCircularPosition(index, activeIndex, cardCount) {
  const forward = (index - activeIndex + cardCount) % cardCount;
  if (forward < cardCount / 2) return forward;
  if (forward > cardCount / 2) return forward - cardCount;
  return index > activeIndex ? forward : forward - cardCount;
}

function getCardStyle(distance, direction, visible) {
  const fixedOffset = 160;
  if (!visible) return { x: direction * fixedOffset, y: 60, scale: 0.55, opacity: 0, zIndex: 0, pointerEvents: 'none' };
  if (distance === 0) return { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 10 };
  if (distance === 1) return { x: direction * fixedOffset, y: 20, scale: 0.85, opacity: 1, zIndex: 5 };
  return { x: direction * fixedOffset, y: 40, scale: 0.7, opacity: 1, zIndex: 3 };
}

function ProjectCard({ card, active, eager }) {
  return (
    <div className={`immersive-card-inner${active ? ' is-active' : ''}`}>
      <div className="immersive-card-image"><ProjectImage src={card.image} alt={card.title} eager={eager} /></div>
      <div className="immersive-card-content">
        <span className="immersive-card-category">{card.category}</span>
        <p className="immersive-card-year">{card.year}</p>
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <div className="immersive-card-tags">{card.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <a href={card.liveUrl} target={card.liveUrl.startsWith('http') ? '_blank' : undefined} rel={card.liveUrl.startsWith('http') ? 'noreferrer' : undefined}>Explore project <ExternalLink size={14} /></a>
      </div>
    </div>
  );
}
