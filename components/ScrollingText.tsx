'use client'
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ScrollingText: React.FC = () => {
  const animatedTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Make sure DOM is loaded and we're in client-side
    if (typeof window === 'undefined' || !animatedTextRef.current) return;

    const animatedText = animatedTextRef.current;
    const originalText = animatedText.textContent?.trim() || '';
    
    // Duplicate the text for a seamless loop
    animatedText.innerHTML = `${originalText} ${originalText}`;
    
    // Apply GSAP ScrollTrigger animation
    const animation = gsap.to(animatedText, {
      scrollTrigger: {
        trigger: animatedText,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      x: "-50%",
      ease: "none",
    });

    // Cleanup function
    return () => {
      if (animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }
      animation.kill();
    };
  }, []);

  return (
    <div className="w-full overflow-hidden ">
      <h1 
        ref={animatedTextRef} 
        className="h-30 mt-30 text-[100px] md:text-[100px] text-amber-500 font-jetbrains-semiBold whitespace-nowrap"
      >
        DROP YOUR HOT TAKES • SPARK A FIRE • REACT IN REAL TIME • STIR THE CONVERSATION • POST YOUR VIBES • CHALLENGE THE NARRATIVE • COMMENT LOUDER • IGNITE THE THREADS • BE HEARD • MAKE YOUR MARK • BRING THE ENERGY • OWN THE CHAT
      </h1>
    </div>
  );
};

export default ScrollingText;