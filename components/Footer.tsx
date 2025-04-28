"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  useEffect(() => {
    const animatedText = document.querySelector(".animated-footer-text");

    if (!animatedText) {
      console.error("No animated text found.");
      return;
    }

    const rotatingWord = animatedText.querySelector(".rotating-word");

    if (!rotatingWord) {
      console.error("No word found with the 'rotating-word' class.");
      return;
    }

    gsap.fromTo(
      rotatingWord,
      {
        rotation: -75,
        y: -80,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: animatedText,
          start: "top 85%",
          toggleActions: "play none none reset",
        },
        rotation: 0,
        y: 0,
        opacity: 1,
        ease: "bounce.out",
        duration: 1.5,
      }
    );
  }, []);

  return (
    <footer className="w-full py-8 flex flex-col items-center justify-center bg-black text-white">
      <h2 className="animated-footer-text text-center text-2xl md:text-4xl font-bold rotating-word">
        <span className="d-inline-flex">Jay Zalani </span>{" "}
        <span className="d-inline-flex">YOUR</span>{" COMMENTS "}
        <span className="d-inline-flex">MADE •</span>{" "}
        <span className="d-inline-flex">WITH</span>{" "}
        <span className="d-inline-flex">💖 •</span>{" "}
        <span className="d-inline-flex">JOIN</span>{" "}
        <span className="d-inline-flex">THE</span>{" "}
        <span className="d-inline-flex">VIBE •</span>{" "}
        <span className="d-inline-flex">COMMENT</span>{" "}
        <span className="d-inline-flex">LOUD •</span>{" "}
        <span className="d-inline-flex">Genc</span>
      </h2>
      <p className="mt-4 text-sm text-gray-400">© 2025 Genc Comments. Stay Loud, Stay Proud.</p>
    </footer>
  );
};

export default Footer;
