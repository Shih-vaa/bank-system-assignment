import { useRef, useEffect, useCallback } from "react";

const ClickSpark = ({
  sparkColor = "#c623e6",
  sparkSize = 3,
  sparkRadius = 30,
  sparkCount = 12,
  duration = 500,
  easing = "ease-out"
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animationRef = useRef(null);

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // Easing functions
  const easeFunc = useCallback((t) => {
    switch (easing) {
      case "linear": return t;
      case "ease-in": return t * t;
      case "ease-in-out": return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default: return t * (2 - t);
    }
  }, [easing]);

  // Handle window resize
  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [initCanvas]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const progress = (timestamp - spark.startTime) / duration;
        if (progress >= 1) return false;

        const eased = easeFunc(progress);
        const distance = eased * sparkRadius;
        const alpha = 1 - eased;

        ctx.beginPath();
        ctx.arc(
          spark.x + distance * Math.cos(spark.angle),
          spark.y + distance * Math.sin(spark.angle),
          sparkSize * (1 + (1 - eased)), // Makes sparks shrink as they fade
          0,
          Math.PI * 2
        );
        ctx.fillStyle = sparkColor;
        ctx.globalAlpha = alpha;
        ctx.fill();

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [sparkColor, sparkSize, sparkRadius, duration, easeFunc]);

  // Click handler
  const handleClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    sparksRef.current = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (Math.PI * 2 * i) / sparkCount,
      startTime: performance.now()
    }));
  }, [sparkCount]);

  // Add click listener
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [handleClick]);

  return (
    <canvas
      ref={canvasRef}
      className="click-spark-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 100
      }}
    />
  );
};

export default ClickSpark;