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
    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label';

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Event delegation: ONE document-level listener instead of attaching
    // (and re-attaching on every DOM mutation) listeners to each element.
    // The old per-element approach leaked listeners every time React
    // re-rendered or the MutationObserver fired.
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

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) {
        onEnter();
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) {
        onLeave();
      }
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
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
