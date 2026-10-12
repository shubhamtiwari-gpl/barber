import React, { useState, useEffect } from 'react';
import { CustomerReview } from '../types';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';

interface ReviewsSliderProps {
  reviews: CustomerReview[];
}

export const ReviewsSlider: React.FC<ReviewsSliderProps> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (reviews.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [reviews.length, isPaused]);

  if (!reviews || reviews.length === 0) return null;

  const current = reviews[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <div
      className="relative rounded-2xl bg-gradient-to-b from-[#18181e] to-[#121215] border border-[#d4af37]/25 p-8 sm:p-12 shadow-2xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header & Quote Icon */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Quote className="w-10 h-10 text-[#d4af37] opacity-80" />
            <div className="flex items-center gap-1">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />
              ))}
            </div>
          </div>

          {/* Prev/Next buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-lg border border-[#2a2a32] bg-[#141418] hover:border-[#d4af37] hover:text-[#d4af37] text-zinc-300 transition-colors focus:outline-none"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-lg border border-[#2a2a32] bg-[#141418] hover:border-[#d4af37] hover:text-[#d4af37] text-zinc-300 transition-colors focus:outline-none"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Review Title & Body */}
        <div className="min-h-[160px] flex flex-col justify-center">
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-4 tracking-wide leading-snug">
            "{current.title}"
          </h3>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-light italic">
            {current.text}
          </p>
        </div>

        {/* Review Metadata */}
        <div className="mt-8 pt-6 border-t border-[#26262e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white tracking-wide text-base">
                {current.author}
              </span>
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs text-[#d4af37]/90 font-medium tracking-wide">
                Verified Client
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
              <span>Ritual: {current.service}</span>
              <span aria-hidden="true">·</span>
              <span>Barber: {current.barber}</span>
              <span aria-hidden="true">·</span>
              <span>{current.date}</span>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-[#d4af37]' : 'w-2 bg-[#2d2d38] hover:bg-zinc-600'
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
