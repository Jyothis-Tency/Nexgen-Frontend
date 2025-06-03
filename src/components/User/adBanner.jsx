"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdBannerCarousel({
  banners = [],
  autoSlideInterval = 5000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);
  const [isHolding, setIsHolding] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Calculate the maximum index based on viewport and number of banners
  const getMaxIndex = () => {
    if (isMobile) {
      return banners.length;
    } else {
      // For desktop view, we show 2 images at a time
      // Subtract 1 to account for 0-based indexing
      return Math.max(0, banners.length - 1);
    }
  };

  // Auto slide functionality
  useEffect(() => {
    if (banners.length <= (isMobile ? 1 : 2) || isHolding) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= getMaxIndex() ? 0 : nextIndex;
      });
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [banners.length, autoSlideInterval, isMobile, isHolding]);

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? getMaxIndex() - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= getMaxIndex() ? 0 : nextIndex;
    });
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }

    if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handlePressStart = () => {
    setIsHolding(true);
  };

  const handlePressEnd = () => {
    setIsHolding(false);
  };

  // If no banners, don't render anything
  if (!banners.length) return null;

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 py-4 md:py-6">
      <div className="container mx-auto px-4">
        <div
          ref={carouselRef}
          className="relative overflow-hidden rounded-lg shadow-md"
          style={{
            height: isMobile ? "200px" : "250px",
            maxWidth: "100%",
            margin: "0 auto",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{
              transform: `translateX(-${
                currentIndex * (isMobile ? 100 : 50)
              }%)`,
            }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className={`h-full flex-shrink-0 flex items-center justify-center ${
                  isMobile ? "w-full" : "w-1/2"
                }`}
              >
                <div
                  className="block w-full h-full p-2 cursor-default"
                  onTouchStart={handlePressStart}
                  onTouchEnd={handlePressEnd}
                  onMouseDown={handlePressStart}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressEnd}
                >
                  <img
                    src={banner.imageUrl || "/placeholder.svg"}
                    alt={banner.altText}
                    className="w-full h-full object-contain rounded-md select-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows - only visible on desktop */}
          {!isMobile && banners.length > 2 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 transition-all"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 transition-all"
                aria-label="Next banner"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Indicator dots */}
          {banners.length > (isMobile ? 1 : 2) && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
              {Array.from({ length: getMaxIndex() }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    currentIndex === index
                      ? "bg-blue-500 w-4"
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
