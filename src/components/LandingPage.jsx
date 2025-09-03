import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fullText = 'Generate POS Receipts';

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    navigate('/generator');
  };

  const getImageTransform = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const rotateX = (mousePosition.y - centerY) / centerY * -5;
    const rotateY = (mousePosition.x - centerX) / centerX * 5;
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  return (
    <div className="min-h-screen font-mail-sans relative" style={{backgroundColor: '#0B0B0B'}}>
      {/* Background Image at Bottom */}
      <div 
        className="absolute bottom-0 left-0 w-full h-64 bg-no-repeat bg-center bg-contain opacity-80"
        style={{
          backgroundImage: 'url(/bg.png)',
          zIndex: 0
        }}
      />
      {/* Hero Section */}
        <div className="px-6 py-8 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          {/* Logo and Title */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <img 
                src="/HYD_logo.svg" 
                alt="Hydrogen Logo" 
                className="h-[58px] w-auto"
              />
            </div>

          </div>
          
          {/* Navigation Buttons - Hidden for now as per design */}
          <div className="flex gap-3 opacity-0">
            <button className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 font-medium hover:bg-gray-800">
              Login
            </button>
            <button className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 font-medium hover:bg-gray-800">
              Sign Up
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-white leading-tight">
                {displayedText}
                <span className="animate-pulse">|</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Select a receipt template and upload your CSV file containing transaction data to generate professional POS receipts. Each transaction will be converted into a downloadable PDF receipt.
              </p>
            </div>

            {/* How it works section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">
                How it works
              </h3>
              
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: '#D1FADF'}}>
                    <img 
                      src="/check-icon.svg" 
                      alt="Check" 
                      className="w-3 h-3"
                      style={{filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(1234%) hue-rotate(120deg) brightness(95%) contrast(95%)'}}
                    />
                  </div>
                  <span className="text-lg font-medium text-white">
                    Select Template
                  </span>
                </div>
                
                {/* Step 2 */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: '#D1FADF'}}>
                    <img 
                      src="/check-icon.svg" 
                      alt="Check" 
                      className="w-3 h-3"
                      style={{filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(1234%) hue-rotate(120deg) brightness(95%) contrast(95%)'}}
                    />
                  </div>
                  <span className="text-lg font-medium text-white">
                    Upload CSV
                  </span>
                </div>
                
                {/* Step 3 */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: '#D1FADF'}}>
                    <img 
                      src="/check-icon.svg" 
                      alt="Check" 
                      className="w-3 h-3"
                      style={{filter: 'brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(1234%) hue-rotate(120deg) brightness(95%) contrast(95%)'}}
                    />
                  </div>
                  <span className="text-lg font-medium text-white">
                    Preview & Download
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button 
                 onClick={handleGetStarted}
                 className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-black hover:opacity-90" 
                 style={{backgroundColor: '#FCE300'}}
               >
                Get Started
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column - Visual/Illustration */}
          <img 
            src="/Frame 1618868501.png" 
            alt="POS Receipt Generator Preview" 
            className="hidden lg:block w-full h-[546px] rounded-2xl object-contain transition-transform duration-300 ease-out"
            style={{ transform: getImageTransform() }}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;