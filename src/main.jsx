import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GlassCard from '../components/GlassCard';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <main className="min-h-screen bg-slate-950 p-6 text-white sm:p-12">
      <GlassCard
        title="SimplaBots Platform"
        category="AI Platform · Next.js"
        description="Agentic AI assistants for businesses with whitelabel configuration, analytics, and multi-model integrations."
        tags={['Next.js', 'TypeScript', 'PostgreSQL', 'OpenAI']}
        liveUrl="https://simplabots.com/"
      />
    </main>
  </StrictMode>,
);
