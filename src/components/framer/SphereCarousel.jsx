import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * SphereCarousel (3D Glass Sphere of Category Cards)
 * Adapted from official Framer component source:
 * https://framer.com/m/Sphere-carousel-8k68ZV.js@HsDYSn2P9Lo8lpYmzmeW
 * 
 * Mathematical Features:
 * - Fibonacci 3D sphere spherical coordinate distribution
 * - Smooth drag-to-spin with momentum & auto-rotation
 * - Glassy depth fade falloff for cards on the far side of the sphere
 * - Connected directly to authenticated user's real expense category records
 */

export default function SphereCarousel({
  items = [],
  onSelectCategory,
  activeCategory,
  cardCount = 20,
  coverage = 0.65,
  cardScale = 0.45,
  cardRatio = 0.85,
  cardRadius = 14,
  cardOpacity = 0.85,
  depthFade = true,
  rotateSpeed = 0.04,
  tilt = 10,
  enableDrag = true,
  backgroundColor = 'transparent',
  style = {},
}) {
  const rootRef = useRef(null);
  const sphereRef = useRef(null);
  const cardRefs = useRef([]);
  const [inView, setInView] = useState(true);
  const [box, setBox] = useState({ w: 480, h: 420 });

  // IntersectionObserver to pause loop when offscreen
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { rootMargin: '100px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Measure container
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) {
        setBox({ w: r.width, h: r.height });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const short = Math.min(box.w, box.h);
  const radius = Math.max(70, (short * coverage) / 2);
  const cardH = Math.max(38, radius * cardScale);
  const cardW = Math.max(32, cardH * cardRatio);
  const perspective = Math.max(650, short * 1.5);
  const count = Math.max(1, Math.min(cardCount, items.length ? Math.max(items.length, 12) : 16));

  const cards = useRef([]);
  cards.current = Array.from({ length: count }, (_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    const rotY = Math.atan2(x, z) * (180 / Math.PI);
    const rotX = Math.asin(-y / radius) * (180 / Math.PI);
    return {
      transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`,
      z,
    };
  });

  const rot = useRef({ rx: tilt, ry: 0, vx: 0, vy: 0, dragging: false, lastX: 0, lastY: 0 });

  const applyDepth = useCallback(() => {
    if (!depthFade) return;
    const s = rot.current;
    const ryRad = (s.ry * Math.PI) / 180;
    for (let i = 0; i < count; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const z0 = cards.current[i]?.z ?? 0;
      const worldZ = z0 * Math.cos(ryRad);
      const t = (worldZ + radius) / (2 * radius); // 0 (back) -> 1 (front)
      el.style.opacity = String(cardOpacity * (0.35 + 0.65 * t));
      el.style.zIndex = String(Math.round(t * 100));
    }
  }, [count, depthFade, radius, cardOpacity]);

  // Auto-spin + Drag Momentum animation loop
  useEffect(() => {
    if (!inView) return;
    const sphere = sphereRef.current;
    if (!sphere) return;

    let raf = 0;
    let prev = performance.now();

    const tick = (now) => {
      const dt = Math.min(64, now - prev);
      prev = now;
      const s = rot.current;

      if (!s.dragging) {
        s.ry += rotateSpeed * dt;
        s.ry += s.vy;
        s.rx += s.vx;
        s.vy *= 0.94;
        s.vx *= 0.94;
      }

      s.rx = Math.max(-50, Math.min(50, s.rx));
      sphere.style.transform = `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`;
      applyDepth();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, rotateSpeed, applyDepth]);

  // Drag Handlers
  const onPointerDown = (e) => {
    if (!enableDrag) return;
    const s = rot.current;
    s.dragging = true;
    s.vx = 0;
    s.vy = 0;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const s = rot.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    s.ry += dx * 0.35;
    s.rx -= dy * 0.35;
    s.vy = dx * 0.25;
    s.vx = -dy * 0.25;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
  };

  const onPointerUp = (e) => {
    rot.current.dragging = false;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div
      ref={rootRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        overflow: 'hidden',
        background: backgroundColor,
        perspective: `${perspective}px`,
        cursor: enableDrag ? 'grab' : 'default',
        touchAction: 'none',
        userSelect: 'none',
        borderRadius: '24px',
        ...style,
      }}
    >
      {/* 3D Rotating Sphere Origin */}
      <div
        ref={sphereRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {cards.current.map((c, i) => {
          const item = items.length ? items[i % items.length] : null;
          const isSelected = item && activeCategory && item.name === activeCategory;
          const Icon = item?.icon;

          return (
            <div
              key={i}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (item && onSelectCategory) {
                  onSelectCategory(item.name);
                }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${cardW}px`,
                height: `${cardH}px`,
                margin: `${-cardH / 2}px 0 0 ${-cardW / 2}px`,
                borderRadius: `${cardRadius}px`,
                overflow: 'hidden',
                background: isSelected
                  ? 'rgba(25, 230, 140, 0.2)'
                  : 'rgba(10, 16, 22, 0.75)',
                border: isSelected
                  ? '1.5px solid var(--accent-green)'
                  : '1px solid rgba(255, 255, 255, 0.16)',
                boxShadow: isSelected
                  ? '0 0 16px rgba(25, 230, 140, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                  : '0 8px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transform: c.transform,
                backfaceVisibility: 'visible',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                textAlign: 'center',
                transition: 'border-color 0.2s ease, background 0.2s ease',
              }}
            >
              {Icon && (
                <div
                  style={{
                    color: item.color || 'var(--accent-green)',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} />
                </div>
              )}
              {item && (
                <>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#f7fafc',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                    }}
                  >
                    {item.name}
                  </span>
                  {typeof item.amount === 'number' && (
                    <span
                      style={{
                        fontSize: '9.5px',
                        color: 'var(--accent-green)',
                        fontWeight: 700,
                        marginTop: '2px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Instructions Pill */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 14px',
          borderRadius: '999px',
          background: 'rgba(5, 7, 9, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(12px)',
          fontSize: '11px',
          color: '#a8b3bf',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-blue)',
            boxShadow: '0 0 8px var(--accent-blue)',
          }}
        />
        <span>Drag to rotate • Click category to inspect</span>
      </div>
    </div>
  );
}
