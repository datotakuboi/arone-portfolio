import { useEffect, useState } from 'react';

export default function PortfolioSkeleton({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      if (active) setLoading(false);
    }, 350);

    return () => { active = false; window.clearTimeout(timer); };
  }, []);

  if (!loading) return children;

  return <main className="portfolio-skeleton" aria-busy="true" aria-label="Loading portfolio">
    <div className="skeleton-nav"><span /><span /><span /><span /><span /><span /></div>
    <section className="skeleton-hero">
      <div className="skeleton-container skeleton-hero-content">
        <div className="skeleton-hero-text">
          <span className="skeleton-line skeleton-subtitle" />
          <span className="skeleton-line skeleton-title" />
          <span className="skeleton-line skeleton-role" />
          <div className="skeleton-description"><span className="skeleton-line skeleton-copy" /><span className="skeleton-line skeleton-copy skeleton-copy-short" /></div>
          <div className="skeleton-actions"><span className="skeleton-line" /><span className="skeleton-line" /></div>
          <div className="skeleton-stats"><span className="skeleton-line" /><span className="skeleton-line" /><span className="skeleton-line" /></div>
        </div>
        <div className="skeleton-hero-image"><span className="skeleton-block skeleton-profile" /></div>
      </div>
    </section>
    <section className="skeleton-section"><div className="skeleton-container"><span className="skeleton-line skeleton-heading" /><div className="skeleton-cards"><span className="skeleton-block" /><span className="skeleton-block" /><span className="skeleton-block" /></div></div></section>
  </main>;
}