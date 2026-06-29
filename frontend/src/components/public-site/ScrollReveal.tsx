"use client";

import { createElement, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export function ScrollReveal({
  children,
  as: Element = "div",
  className = "",
  delay = 0,
}: Readonly<{
  children: ReactNode;
  as?: "div" | "section";
  className?: string;
  delay?: number;
}>) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return createElement(
    Element,
    {
      ref: (node: HTMLElement | null) => {
        ref.current = node;
      },
      className: `reveal-up ${isVisible ? "is-visible" : ""} ${className}`,
      style: { "--reveal-delay": `${delay}ms` } as CSSProperties,
    },
    children,
  );
}
