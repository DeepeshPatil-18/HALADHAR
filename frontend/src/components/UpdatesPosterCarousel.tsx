import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UpdatePoster {
  id: string;
  type: string;
  image: string;
  title: string;
  subtitle: string;
  route: string;
}

interface UpdatesPosterCarouselProps {
  posters: UpdatePoster[];
}

export function UpdatesPosterCarousel({ posters }: UpdatesPosterCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll interval (5 seconds)
  const AUTO_SCROLL_INTERVAL = 5000;

  // Start auto-scroll timer
  const startAutoScroll = () => {
    // Clear any existing timer
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }

    // Only start auto-scroll if there are multiple posters
    if (posters.length > 1) {
      autoScrollTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % posters.length;
          scrollToIndex(nextIndex, true);
          return nextIndex;
        });
      }, AUTO_SCROLL_INTERVAL);
    }
  };

  // Stop auto-scroll timer
  const stopAutoScroll = () => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  };

  // Initialize auto-scroll on mount
  useEffect(() => {
    startAutoScroll();

    return () => {
      stopAutoScroll();
    };
  }, [posters.length]);

  // Handle manual scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth - 32;
      const newIndex = Math.round(scrollLeft / cardWidth);
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        // Reset auto-scroll timer after manual interaction
        stopAutoScroll();
        setTimeout(() => {
          startAutoScroll();
        }, 1000); // Resume auto-scroll after 1 second
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex]);

  const scrollToIndex = (index: number, smooth: boolean = true) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth - 32;
    container.scrollTo({
      left: index * cardWidth,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  const handlePosterClick = (poster: UpdatePoster) => {
    stopAutoScroll(); // Stop auto-scroll when user interacts
    if (poster.route) {
      navigate(poster.route);
    }
  };

  const handleIndicatorClick = (index: number) => {
    stopAutoScroll(); // Stop auto-scroll on manual interaction
    setCurrentIndex(index);
    scrollToIndex(index);
    setTimeout(() => {
      startAutoScroll(); // Resume after 1 second
    }, 1000);
  };

  if (posters.length === 0) {
    return null;
  }

  return (
    <div className="relative px-4">
      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-3"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {posters.map((poster) => (
          <div
            key={poster.id}
            onClick={() => handlePosterClick(poster)}
            className="flex-shrink-0 w-full snap-center"
          >
            {/* Poster Banner with Image */}
            <div
              className="relative overflow-hidden rounded-xl cursor-pointer 
                          hover:shadow-lg transition-all active:scale-[0.98]
                          bg-gray-200"
              style={{ 
                aspectRatio: '16/9',
                minHeight: '180px'
              }}
            >
              {/* Poster Image */}
              <img
                src={poster.image}
                alt={poster.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Dark Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                {/* Text Content - Bottom Left */}
                <div className="mb-2">
                  <h3 className="text-[17px] font-bold text-white mb-1 leading-[1.3] drop-shadow-lg"
                      style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                    {poster.title}
                  </h3>
                  <p className="text-[12px] text-white/95 leading-[1.4] drop-shadow-md"
                     style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                    {poster.subtitle}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="flex justify-end">
                  <div className="flex items-center gap-1 text-white font-bold text-[11px] bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30"
                       style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                    <span>जानें</span>
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Indicators */}
      {posters.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {posters.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`transition-all ${
                currentIndex === index
                  ? 'w-6 h-1.5 bg-[#0b5e2c] rounded-full'
                  : 'w-1.5 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hide Scrollbar CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
