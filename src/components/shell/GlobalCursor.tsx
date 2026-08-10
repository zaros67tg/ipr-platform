'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function GlobalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 600, damping: 35, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 600, damping: 35, mass: 0.4 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.width = '48px';
        cursorRef.current.style.height = '48px';
      }
    };
    const onLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.width = '18px';
        cursorRef.current.style.height = '18px';
      }
    };

    window.addEventListener('mousemove', move);

    // Expand cursor over all clickable elements
    const selectors = 'a, button, [role="button"], input, textarea, select, label';
    document.querySelectorAll(selectors).forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll(selectors).forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', move);
      observer.disconnect();
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cursorRef}
      className="pointer-events-none fixed z-[99999] mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: 18,
        height: 18,
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        transition: 'width 0.18s ease, height 0.18s ease',
      }}
    />
  );
}
