import { useEffect, useRef } from 'react';

interface BackgroundParticlesProps {
  darkMode: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
}

export function BackgroundParticles({ darkMode }: BackgroundParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 45;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const colors = darkMode
      ? [
          'rgba(245, 179, 53, ',  // Gold variant
          'rgba(255, 217, 120, ', // Basic/Honey Glow
          'rgba(236, 72, 153, ',  // Gummy pink glow
          'rgba(129, 140, 248, ', // Galaxy blue-indigo glow
        ]
      : [
          'rgba(179, 139, 109, ', // Soft warm brown
          'rgba(245, 179, 53, ',  // Amber/Gold
          'rgba(163, 143, 114, ', // Soft warm gold gray
        ];

    const createParticle = (initY = false): Particle => {
      const colorTemplate = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * window.innerWidth,
        y: initY ? Math.random() * window.innerHeight : window.innerHeight + Math.random() * 20,
        size: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: -(Math.random() * 0.35 + 0.15),
        opacity: Math.random() * 0.4 + 0.15,
        fadeSpeed: (Math.random() * 0.004) + 0.001,
        color: colorTemplate,
      };
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Apply a very slight horizontal wave drift over time
        p.speedX += (Math.random() - 0.5) * 0.015;
        p.speedX = Math.max(-0.4, Math.min(0.4, p.speedX));

        // Pulsing opacity
        p.opacity += p.fadeSpeed;
        if (p.opacity >= 0.75 || p.opacity <= 0.1) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Draw particle with subtle glow if in dark mode
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        const alpha = Math.max(0.01, Math.min(0.85, p.opacity));
        ctx.fillStyle = `${p.color}${alpha})`;
        
        if (darkMode) {
          ctx.shadowBlur = p.size * 1.5;
          ctx.shadowColor = `${p.color}${alpha})`;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();

        // Reset if offscreen (top, left, or right limits)
        if (p.y < -10 || p.x < -10 || p.x > window.innerWidth + 10) {
          particles[i] = createParticle(false);
        }
      }

      // Reset shadows for next operations
      if (darkMode) {
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: darkMode ? 'screen' : 'multiply' }}
    />
  );
}
