import { useEffect, useState } from "react";
import { motion } from "framer-motion";








const AnimatedCounter = ({ target, duration = 2, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
