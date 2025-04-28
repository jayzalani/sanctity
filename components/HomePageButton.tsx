'use client'
import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import gsap from 'gsap';

const HomePageButton: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    
    let boundingRect = button.getBoundingClientRect();
    
    const updateBoundingRect = (): void => {
      boundingRect = button.getBoundingClientRect();
    };
    
    const handleMouseMove = (e: MouseEvent): void => {
      const mousePosX = e.clientX - boundingRect.left;
      const mousePosY = e.clientY - boundingRect.top;
      
      gsap.to(button, {
        x: (mousePosX - boundingRect.width / 2) * 0.4,
        y: (mousePosY - boundingRect.height / 2) * 0.4,
        duration: 0.8,
        ease: 'power3.out',
      });
    };
    
    const handleMouseLeave = (): void => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1,0.3)',
      });
    };
    
    // Initialize
    updateBoundingRect();
    
    // Add event listeners
    window.addEventListener('resize', updateBoundingRect);
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateBoundingRect);
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <div>
      <Button 
        ref={buttonRef}
        className='bg-amber-500 text-5xl p-10 rounded-4xl font-jetbrains-semiBold'
      >
        <Link href='/comments'>START THE WAR!</Link>
      </Button>
    </div>
  );
};

export default HomePageButton;