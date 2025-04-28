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
    <footer className="w-full h-60 py-8 flex flex-col items-center justify-center bg-black text-white">
      <h2 className="animated-footer-text text-center text-2xl md:text-4xl font-bold ">
        <span className="d-inline-flex rotating-word">Made by  </span>{" "}
        <span className="d-inline-flex rotating-word">JAY ZALANI</span>{" "}
        <span className="d-inline-flex rotating-word">With •</span>{" "}
        <span className="d-inline-flex rotating-word">💖</span>{" "}
        <span className="d-inline-flex rotating-word">•</span>{" "}
        <span className="d-inline-flex rotating-word">JOIN</span>{" "}
        <span className="d-inline-flex rotating-word">THE</span>{" "}
        <span className="d-inline-flex rotating-word">VIBE •</span>{" "}
        <span className="d-inline-flex rotating-word">COMMENT</span>{" "}
        <span className="d-inline-flex rotating-word">LOUD •</span>{" "}
        <span className="d-inline-flex rotating-word">GenZ⚡</span>
      </h2>
      <p className="mt-4 text-sm text-gray-400">© 2025 GenZ Comments. Stay Loud, Stay Proud.</p>
    </footer>
  );
};

export default Footer;
