import { useEffect, useState } from 'react';

export default function PortfolioSkeleton({ images, children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const preloadImage = (source) => new Promise((resolve) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = source;
    });

    Promise.all(images.map(preloadImage)).then(() => {
      if (active) setLoading(false);
    });

    return () => { active = false; };
  }, [images]);

  if (!loading) return children;

  return <main className="portfolio-skeleton" aria-busy="true" aria-label="Loading portfolio">
    <header className="skeleton-header"><span className="skeleton-line skeleton-logo" /><span className="skeleton-line skeleton-nav" /></header>
    <section className="skeleton-hero"><span className="skeleton-line skeleton-eyebrow" /><span className="skeleton-line skeleton-title" /><span className="skeleton-line skeleton-title skeleton-title-short" /><div className="skeleton-hero-grid"><div><span className="skeleton-line skeleton-copy" /><span className="skeleton-line skeleton-copy skeleton-copy-short" /><span className="skeleton-line skeleton-button" /></div><span className="skeleton-block skeleton-profile" /></div></section>
    <section className="skeleton-section"><span className="skeleton-line skeleton-heading" /><div className="skeleton-cards"><span className="skeleton-block" /><span className="skeleton-block" /><span className="skeleton-block" /></div></section>
  </main>;
}