import { ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export const ScrollToTop = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const currentProgress = (document.documentElement.scrollTop / totalHeight) * 100;
    setScrollProgress(currentProgress);

    // Show button when user scrolls down a certain amount (e.g., 200px)
    if (document.documentElement.scrollTop > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // For smooth scrolling
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  // CSS for circular progress can be handled using inline styles or a CSS module
  // This example uses inline styles for simplicity.
  const circleStyle = {
    // A simple way to visualize progress with a conic gradient
    background: `conic-gradient(oklch(69.6% 0.17 162.48) ${scrollProgress}%, oklch(50.8% 0.118 165.612) ${scrollProgress}%)`,
  };

  return (
    <button
      onClick={scrollToTop}
      style={circleStyle}
      className="fixed flex items-center justify-center bottom-5 right-5 p-2 rounded-full shadow-lg transition-opacity duration-300 hover:opacity-90"
      aria-label="Scroll to top"
    >
      {/* Arrow icon inside the circle */}
      <ChevronUp className="text-white" />
    </button>
  );
};