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
    const particleCount = 30;

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
          'rgba(168, 85, 247, ',  // Cosmic Violet
          'rgba(6, 182, 212, ',   // Astral Cyan
          'rgba(236, 72, 153, ',  // Nebula Magenta
          'rgba(192, 132, 252, ', // Starlight Purple
        ]
      : [
          'rgba(147, 51, 234, ',  // Mystic Violet
          'rgba(8, 145, 178, ',   // Arcane Cyan
          'rgba(196, 181, 253, ', // Soft Lavender
        ];

    const createParticle = (initY = false): Particle => {
      const colorTemplate = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * window.innerWidth,
        y: initY ? Math.random() * window.innerHeight : window.innerHeight + Math.random() * 20,
        size: Math.random() * 1.4 + 0.5,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -(Math.random() * 0.25 + 0.1),
        opacity: Math.random() * 0.15 + 0.05,
        fadeSpeed: (Math.random() * 0.002) + 0.0008,
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
        p.speedX += (Math.random() - 0.5) * 0.01;
        p.speedX = Math.max(-0.25, Math.min(0.25, p.speedX));

        // Pulsing opacity
        p.opacity += p.fadeSpeed;
        if (p.opacity >= 0.25 || p.opacity <= 0.03) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Draw particle with subtle glow if in dark mode
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        const alpha = Math.max(0.02, Math.min(0.25, p.opacity));
        ctx.fillStyle = `${p.color}${alpha})`;
        
        if (darkMode) {
          ctx.shadowBlur = p.size * 1.2;
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
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
      style={{ mixBlendMode: darkMode ? 'screen' : 'multiply' }}
    />
  );
}
