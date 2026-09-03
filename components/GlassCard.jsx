import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, GitBranch, Sparkles } from 'lucide-react';

const springConfig = { stiffness: 260, damping: 20, mass: 0.8 };

export default function GlassCard({
  title = 'Interactive Physics Card',
  category = 'Full Stack · Next.js',
  description = 'A high-performance glassmorphic component with real-time cursor tracking, spring physics, and subtle ambient glows.',
  tags = ['Next.js 15', 'Framer Motion', 'Tailwind CSS'],
  image,
  year,
  className = '',
  repositoryUrl = '#',
  liveUrl = '#',
}) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

  function handleMouseMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left) / bounds.width - 0.5);
    y.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }

  return (
    <div className={`relative flex min-h-[450px] items-center justify-center overflow-hidden rounded-2xl bg-[#17211d] p-8 ${className}`}>
      <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-[#d7f45b]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-[#ff7448]/20 blur-3xl" />

      <div className="w-full max-w-md [perspective:1000px]">
        <motion.article
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', ...springConfig }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`group relative w-full cursor-pointer select-none rounded-2xl border border-white/15 bg-white/[0.06] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md backdrop-saturate-150 transition-colors duration-300 hover:border-[#d7f45b]/70 hover:shadow-[0_12px_40px_0_rgba(215,244,91,0.16)] ${className}`}
        >
          {image && (
            <div className="mb-5 h-40 overflow-hidden rounded-xl border border-white/10">
              <img src={image} alt="" className="h-full w-full object-cover object-top opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
            </div>
          )}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
            animate={{ opacity: isHovered ? 1 : 0 }}
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            }}
          />

          <div className="relative z-10 space-y-4 [transform:translateZ(20px)]">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d7f45b]/30 bg-[#d7f45b]/10 px-3 py-1 text-xs font-medium text-[#d7f45b]">
                <Sparkles size={12} aria-hidden="true" />
                {category}
              </span>
              {year && <span className="text-xs text-slate-500">{year}</span>}
              <div className="flex items-center gap-2">
                <IconButtonTooltip label="View repository" href={repositoryUrl}>
                  <GitBranch size={18} aria-hidden="true" />
                </IconButtonTooltip>
                <IconButtonTooltip label="Live preview" href={liveUrl}>
                  <ExternalLink size={18} aria-hidden="true" />
                </IconButtonTooltip>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold tracking-tight text-[#f3f1e9] transition-colors group-hover:text-[#d7f45b]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
            {liveUrl !== '#' && <a className="glass-card-cta" href={liveUrl} target={liveUrl.startsWith('http') ? '_blank' : undefined} rel={liveUrl.startsWith('http') ? 'noreferrer' : undefined}>Explore project <span aria-hidden="true">→</span></a>}
          </div>
        </motion.article>
      </div>
    </div>
  );
}

function IconButtonTooltip({ children, label, href }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <a
        href={href}
        target={href === '#' ? undefined : '_blank'}
        rel={href === '#' ? undefined : 'noreferrer'}
        aria-label={label}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-[#f3f1e9]/60 transition-all hover:bg-[#ff7448]/20 hover:text-[#f3f1e9] focus:outline-none focus:ring-2 focus:ring-[#d7f45b]/50"
      >
        {children}
      </a>
      <motion.span
        role="tooltip"
        initial={{ opacity: 0, y: 6, scale: 0.95 }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6, scale: show ? 1 : 0.95 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-white/15 bg-[#17211d]/95 px-2.5 py-1 text-[11px] font-medium text-[#f3f1e9] shadow-lg backdrop-blur-md"
      >
        {label}
      </motion.span>
    </div>
  );
}
