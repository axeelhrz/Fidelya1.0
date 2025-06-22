'use client';

import { useEffect, useState } from 'react';

// Futuristic CSS-in-JS Styles
const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'optimizeLegibility',
    fontFeatureSettings: "'rlig' 1, 'calt' 1",
    lineHeight: 1.5,
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
    backgroundAttachment: 'fixed',
    color: '#ffffff',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  
  globalContainer: {
    position: 'relative' as const,
    minHeight: '100vh',
    overflow: 'auto',
    zIndex: 10,
  },
  
  particleCanvas: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none' as const,
  },
  
  backgroundEffects: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'none' as const,
    background: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
    `,
    animation: 'float 20s ease-in-out infinite',
  },
  
  gridOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 3,
    pointerEvents: 'none' as const,
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    opacity: 0.4,
  },
  
  scanlines: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 4,
    pointerEvents: 'none' as const,
    background: 'linear-gradient(transparent 50%, rgba(0, 255, 255, 0.02) 50%)',
    backgroundSize: '100% 4px',
    animation: 'scanlines 0.1s linear infinite',
  },
  
  cursor: {
    position: 'fixed' as const,
    width: '20px',
    height: '20px',
    background: 'radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, rgba(0, 255, 255, 0.2) 50%, transparent 100%)',
    borderRadius: '50%',
    pointerEvents: 'none' as const,
    zIndex: 9999,
    mixBlendMode: 'screen' as const,
    transition: 'transform 0.1s ease-out',
  },
};

// Particle System Component
const ParticleSystem = () => {
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];
    
    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#00ffff' : '#ff00ff',
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Connect nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (100 - distance) / 100 * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <canvas id="particle-canvas" style={styles.particleCanvas} />;
};

// Custom Cursor Component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  
  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  return (
    <div
      style={{
        ...styles.cursor,
        left: position.x - 10,
        top: position.y - 10,
        transform: isClicking ? 'scale(1.5)' : 'scale(1)',
      }}
    />
  );
};

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Apply body styles
    Object.assign(document.body.style, styles.body);
    
    // Inject global styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      html {
        scroll-behavior: smooth;
        -webkit-text-size-adjust: 100%;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      body {
        cursor: none;
      }
      
      ::selection {
        background: rgba(0, 255, 255, 0.3);
        color: #00ffff;
      }
      
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(45deg, #00ffff, #ff00ff);
        border-radius: 4px;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }
      
      ::-webkit-scrollbar-thumb:hover {
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-20px) rotate(120deg); }
        66% { transform: translateY(10px) rotate(240deg); }
      }
      
      @keyframes scanlines {
        0% { transform: translateY(0); }
        100% { transform: translateY(4px); }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
        50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.3); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      @keyframes matrix {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
      
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);
  
  if (!mounted) {
    return (
      <div style={styles.globalContainer}>
        {children}
      </div>
    );
  }
  
  return (
    <>
      {/* Particle System */}
      <ParticleSystem />
      
      {/* Background Effects */}
      <div style={styles.backgroundEffects} />
      
      {/* Grid Overlay */}
      <div style={styles.gridOverlay} />
      
      {/* Scanlines */}
      <div style={styles.scanlines} />
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Main Content */}
      <div style={styles.globalContainer}>
        {children}
      </div>
    </>
  );
}
