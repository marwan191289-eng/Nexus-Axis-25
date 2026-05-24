import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  startOnMount?: boolean;
}

export function useCountUp({
  target,
  duration = 2000,
  suffix = "",
  prefix = "",
  startOnMount = false,
}: UseCountUpOptions) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(startOnMount);
  const ref = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (startOnMount) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [startOnMount]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = performance.now();

    function easeOutQuart(t: number) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      setCount(Math.round(easedProgress * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [hasStarted, target, duration]);

  const display = `${prefix}${count.toLocaleString()}${suffix}`;

  return { count, display, ref };
}
