import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HomeMotion() {
  useEffect(() => {
    const root = document.getElementById('portfolio-root');
    const title = root?.querySelector('.hero-title .text-highlight');
    if (!root || !title) return undefined;

    const originalTitle = title.textContent.trim();
    let characterIndex = 0;
    title.replaceChildren(...originalTitle.split(' ').flatMap((word, wordIndex) => {
      const wordElement = document.createElement('span');
      wordElement.className = 'title-character-word';
      [...word].forEach((character) => {
        const mask = document.createElement('span');
        const letter = document.createElement('span');
        mask.className = 'title-character-mask';
        letter.className = 'title-character';
        letter.textContent = character;
        letter.setAttribute('aria-hidden', 'true');
        mask.append(letter);
        mask.style.setProperty('--character-index', characterIndex);
        wordElement.append(mask);
        characterIndex += 1;
      });
      return wordIndex === 0 ? [wordElement] : [document.createTextNode(' '), wordElement];
    }));
    title.setAttribute('aria-label', originalTitle);

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.85 });
    const lenisFrame = (time) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(lenisFrame);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.fromTo('.title-character', { yPercent: 115 }, { yPercent: 0, duration: 1.05, ease: 'power4.out', stagger: 0.027, delay: 0.2 });
      gsap.utils.toArray('.immersive-card-image').forEach((cardImage) => {
        const image = cardImage.querySelector('img');
        gsap.fromTo(cardImage, { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.15, ease: 'power4.inOut', scrollTrigger: { trigger: cardImage, start: 'top 88%', once: true } });
        gsap.fromTo(image, { scale: 1.2 }, { scale: 1, duration: 1.25, ease: 'power3.out', scrollTrigger: { trigger: cardImage, start: 'top 88%', once: true } });
      });
      const sectionAnimations = [
        ['#experience', '.experience-item'],
        ['#skills', '.skill-category'],
        ['#about', '.about-card'],
        ['#education', '.education-item, .subsection-title, .cert-item'],
        ['#contact', '.contact-intro, .contact-item, .contact-cta'],
      ];
      sectionAnimations.forEach(([sectionSelector, contentSelector]) => {
        const section = root.querySelector(sectionSelector);
        const heading = section?.querySelector('.section-title');
        const content = section ? gsap.utils.toArray(contentSelector, section) : [];
        if (!section || !heading) return;
        const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 72%', once: true } });
        timeline.fromTo(heading, { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.82, ease: 'power4.out' });
        timeline.fromTo(content, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', stagger: 0.1 }, '-=0.38');
      });
    }, root);

    const magneticItems = root.querySelectorAll('.floating-pill-navigation a, .hero-cta .btn');
    const resetMagnetic = (event) => gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.35)' });
    const moveMagnetic = (event) => {
      const item = event.currentTarget;
      const bounds = item.getBoundingClientRect();
      gsap.to(item, { x: (event.clientX - bounds.left - bounds.width / 2) * 0.15, y: (event.clientY - bounds.top - bounds.height / 2) * 0.15, duration: 0.28, ease: 'power2.out', overwrite: true });
    };
    magneticItems.forEach((item) => { item.addEventListener('pointermove', moveMagnetic); item.addEventListener('pointerleave', resetMagnetic); });

    return () => {
      context.revert();
      gsap.ticker.remove(lenisFrame);
      lenis.destroy();
      title.textContent = originalTitle;
      title.removeAttribute('aria-label');
      magneticItems.forEach((item) => { item.removeEventListener('pointermove', moveMagnetic); item.removeEventListener('pointerleave', resetMagnetic); });
    };
  }, []);

  return null;
}