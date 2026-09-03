import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PortfolioApp from '../components/PortfolioApp';
import './index.css';
import '../style.css';

const portfolioRoot = document.getElementById('portfolio-root');

if (portfolioRoot) {
  document.querySelectorAll('body > .navbar, body > section, body > .footer').forEach((legacyNode) => legacyNode.remove());
  createRoot(portfolioRoot).render(
    <StrictMode>
      <PortfolioApp />
    </StrictMode>,
  );
}
