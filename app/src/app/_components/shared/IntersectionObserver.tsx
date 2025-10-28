"use client";

import { useEffect, useRef } from "react";

interface IntersectionObserverProps {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Reusable Intersection Observer component
 * Triggers a callback when the component enters the viewport
 *
 * @param onIntersect - Callback to trigger when element intersects
 * @param enabled - Whether the observer is active (default: true)
 * @param rootMargin - Margin around the root (default: "100px")
 * @param threshold - Intersection threshold 0-1 (default: 0.1)
 * @param children - Optional children to render
 * @param className - Optional CSS classes
 */
export function IntersectionObserver({
  onIntersect,
  enabled = true,
  rootMargin = "100px",
  threshold = 0.1,
  children,
  className = "",
}: IntersectionObserverProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          onIntersect();
        }
      },
      {
        rootMargin,
        threshold,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, enabled, rootMargin, threshold]);

  return (
    <div ref={targetRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Simpler hook-based version if you want more control
 */
export function useIntersectionObserver(
  callback: () => void,
  options?: {
    enabled?: boolean;
    rootMargin?: string;
    threshold?: number;
  },
) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { enabled = true, rootMargin = "100px", threshold = 0.1 } = options ?? {};

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          callback();
        }
      },
      {
        rootMargin,
        threshold,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [callback, enabled, rootMargin, threshold]);

  return targetRef;
}
