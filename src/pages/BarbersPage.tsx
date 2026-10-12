import React from 'react';
import { BarberProfile } from '../types';
import { Star, Award, Calendar, Scissors, Sparkles, CheckCircle2 } from 'lucide-react';

interface BarbersPageProps {
  barbers: BarberProfile[];
  onNavigate: (tab: string) => void;
  onSelectBarberForBooking: (barberId: string) => void;
}

export const BarbersPage: React.FC<BarbersPageProps> = ({
  barbers,
  onNavigate,
  onSelectBarberForBooking,
}) => {
  const handleBook = (barberId: string) => {
    onSelectBarberForBooking(barberId);
    onNavigate('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
          The Craftmasters
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white tracking-wide">
          MEET OUR MASTER BARBERS
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base mt-4 font-light leading-relaxed">
          Trained in historical grooming capitals across London, Milan, and New York. Each artisan at Crown & Blade brings an obsessive eye for detail and personalized ergonomics.
        </p>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="rounded-2xl bg-[#141419] border border-[#25252e] hover:border-[#d4af37]/45 transition-all overflow-hidden shadow-2xl group flex flex-col sm:flex-row"
          >
            {/* Barber Portrait */}
            <div className="sm:w-2/5 relative h-72 sm:h-auto overflow-hidden bg-[#0c0c0e] shrink-0">
              <img
                src={barber.avatar}
                alt={barber.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent via-transparent to-[#141419]/90 sm:to-[#141419]" />

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0c0c0e]/85 backdrop-blur-md border border-[#d4af37]/40 text-[11px] text-[#d4af37] font-bold flex items-center gap-1.5 shadow-md">
                <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                <span>{barber.rating} ({barber.reviewsCount})</span>
              </div>
            </div>

            {/* Barber Details */}
            <div className="sm:w-3/5 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
                    {barber.role}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{barber.experienceYears} Years Exp</span>
                  </div>
                </div>

                <h3 className="font-cinzel text-2xl font-bold text-white group-hover:text-[#d4af37] transition-colors mb-2">
                  {barber.name}
                </h3>

                <div className="mb-4">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block mb-0.5">
                    Specialty
                  </span>
                  <p className="text-xs font-medium text-zinc-200">
                    {barber.specialty}
                  </p>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4">
                  {barber.bio}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-[#191922] p-2.5 rounded-lg border border-[#23232c]">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span className="truncate">{barber.availability}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#22222a]">
                <button
                  onClick={() => handleBook(barber.id)}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89025] hover:from-[#e2c158] hover:to-[#c69d2f] text-[#0d0d10] font-bold text-xs uppercase tracking-widest transition-all shadow-md shadow-[#d4af37]/15 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Book With {barber.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Standards & Certifications Section */}
      <div className="rounded-2xl bg-[#121217] border border-[#24242d] p-8 sm:p-12">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
            Excellence Without Compromise
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
            THE CROWN & BLADE CRAFT CODE
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
            Every master barber in our lounge undergoes annual re-certification in surgical sanitation, classic straight-edge stropping, and ergonomic facial topology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-xl bg-[#171720] border border-[#262632] space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Hospital-Grade Sanitation</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Medical-grade autoclave sterilization for all shears and combs between patrons. Every single razor uses a fresh single-use Japanese blade.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#171720] border border-[#262632] space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Anatomical Consultation</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              We never start cutting right away. We assess your hair growth whorls, cowlicks, density, and jaw symmetry to ensure an enduring cut.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#171720] border border-[#262632] space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Organic Formulation Exclusives</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Zero synthetic fragrances, parabens, or sulfates. Only cold-pressed botanicals, argan, jojoba, and sandalwood extracts applied to your scalp and skin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
