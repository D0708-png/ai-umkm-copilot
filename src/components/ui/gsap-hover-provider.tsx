"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const selector =
  ".hover-card, .data-row, .product-card, .stock-row, .category-item, .chip-button, .prompt-list a";

export function GsapHoverProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!canHover) {
      return;
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const cleanups: (() => void)[] = [];

    elements.forEach((element) => {
      element.style.transformStyle = "preserve-3d";
      element.style.willChange = "transform";

      const handleMouseEnter = () => {
        gsap.to(element, {
          y: -4,
          scale: 1.015,
          duration: 0.22,
          ease: "power2.out",
        });
      };

      const handleMouseMove = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(element, {
          x: x * 5,
          y: -4 + y * 4,
          rotateX: -y * 4,
          rotateY: x * 4,
          scale: 1.015,
          transformPerspective: 900,
          duration: 0.28,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.28,
          ease: "power2.out",
          clearProps: "transform",
        });
      };

      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);

      cleanups.push(() => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
        gsap.killTweensOf(element);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return null;
}