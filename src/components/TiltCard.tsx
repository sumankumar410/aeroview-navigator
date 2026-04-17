import { useRef, useState, useCallback } from "react";

/**
 * Wraps children in a 3D tilt effect that follows the cursor.
 * Disabled on touch / reduced-motion automatically.
 */
const TiltCard = ({ children, className = "", max = 12 }: { children: React.ReactNode; className?: string; max?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)");

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * max;
    const ry = (x - 0.5) * max;
    setTransform(`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`);
  }, [max]);

  const reset = () => setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)");

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ transform, transition: "transform 0.25s ease-out", transformStyle: "preserve-3d", willChange: "transform" }}
      className={className}
    >
      {children}
    </div>
  );
};

export default TiltCard;
