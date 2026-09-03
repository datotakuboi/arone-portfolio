import { useEffect, useState, startTransition } from 'react';
import { motion } from 'framer-motion';
import './floating-pill-navigation.css';

const items = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export default function FloatingPillNavigation() {
  const [activeLink, setActiveLink] = useState('Home');

  useEffect(() => {
    const sections = items.map((item) => document.querySelector(item.href)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const item = items.find((candidate) => candidate.href === `#${visible.target.id}`);
        if (item) startTransition(() => setActiveLink(item.label));
      }
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="floating-pill-navigation" aria-label="Primary navigation">
      {items.map((item) => {
        const active = item.label === activeLink;
        return (
          <a key={item.label} href={item.href} className={active ? 'is-active' : ''} onClick={() => setActiveLink(item.label)}>
            {active && <motion.span className="floating-pill-active" layoutId="floating-pill-active" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
            <span className="floating-pill-label">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
