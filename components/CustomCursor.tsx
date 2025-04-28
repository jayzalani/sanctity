"use client"
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cursorRef.current || !followerRef.current || !glowRef.current) return;

    // Create a context so we can use GSAP's ticker
    const ctx = gsap.context(() => {
      // Set initial positions to prevent cursor jump on load
      gsap.set([cursorRef.current, followerRef.current, glowRef.current], {
        xPercent: -50,
        yPercent: -50,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
      
      // Animation variables
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      
      // Track mouse position
      window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
      
      // Use GSAP ticker for smooth animation
      gsap.ticker.add(() => {
        if (!cursorRef.current || !followerRef.current || !glowRef.current) return;
        
        // Animate cursor (fastest)
        gsap.to(cursorRef.current, {
          duration: 0.1,
          x: mouseX,
          y: mouseY,
          overwrite: "auto",
          ease: "power2.out"
        });
        
        // Animate follower (medium speed)
        gsap.to(followerRef.current, {
          duration: 0.4,
          x: mouseX,
          y: mouseY,
          overwrite: "auto",
          ease: "power3.out"
        });
        
        // Animate glow effect (slowest - most trailing)
        gsap.to(glowRef.current, {
          duration: 0.8,
          x: mouseX,
          y: mouseY,
          overwrite: "auto",
          ease: "power4.out"
        });
      });
      
      // Add subtle pulsing animation to the glow
      gsap.to(glowRef.current, {
        scale: 1.1,
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
    
    // Clean up function
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Outer glow effect (slowest) */}
      <div 
        ref={glowRef}
        style={{
          position: 'fixed',
          width: '32px',
          height: '32px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          boxShadow: '0 0 12px 2px rgba(0, 0, 0, 0.2)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9997,
          top: 0,
          left: 0,
          opacity: 0.7
        }}
      />
      
      {/* Follower circle */}
      <div 
        ref={followerRef}
        style={{
          position: 'fixed',
          width: '16px',
          height: '16px',
          border: '1px solid rgba(0, 0, 0, 0.7)',
          boxShadow: '0 0 4px 1px rgba(0, 0, 0, 0.3)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          top: 0,
          left: 0
        }}
      />
      
      {/* Main cursor dot */}
      <div 
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: '4px',
          height: '4px',
          backgroundColor: 'black',
          boxShadow: '0 0 3px 0px rgba(0, 0, 0, 0.8)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          top: 0,
          left: 0
        }}
      />
    </>
  );
};

export default CustomCursor;