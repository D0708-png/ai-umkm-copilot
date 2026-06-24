"use client";

import { useEffect, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

const formatter = new Intl.NumberFormat("id-ID");

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function formatValue(value: number, prefix: string, suffix: string) {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const absoluteValue = Math.abs(rounded);

  return `${sign}${prefix}${formatter.format(absoluteValue)}${suffix}`;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 900,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const startTime = performance.now();

    function animate(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    }

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [value, duration]);

  return <>{formatValue(displayValue, prefix, suffix)}</>;
}