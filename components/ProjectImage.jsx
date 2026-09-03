import { useState } from 'react';

export default function ProjectImage({ src, alt, eager = false }) {
  const [status, setStatus] = useState('loading');

  return <div className={`project-image-frame is-${status}`}>
    {status === 'loading' && <span className="project-image-skeleton" aria-hidden="true" />}
    {status === 'error' && <div className="project-image-fallback" role="img" aria-label={`${alt} preview unavailable`}>Preview unavailable</div>}
    <img
      src={src}
      alt={alt}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      loading={eager ? 'eager' : 'lazy'}
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
    />
  </div>;
}