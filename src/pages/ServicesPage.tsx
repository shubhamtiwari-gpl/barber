import React, { useState } from 'react';
import { ServiceItem } from '../types';
import { Clock, Sparkles, Check, ArrowRight, Crown, ShieldAlert } from 'lucide-react';

interface ServicesPageProps {
  services: ServiceItem[];
  onNavigate: (tab: string) => void;
  onSelectServiceForBooking: (serviceId: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  onNavigate,
  onSelectServiceForBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'hair', label: 'Hair Sculpting' },
    { id: 'beard', label: 'Beard & Hot Shave' },
    { id: 'royal', label: 'Royal Experiences' },
    { id: 'treatments', label: 'Scalp & Facials' },
  ];

  const filteredServices =
    selectedCategory === 'all'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  const handleBook = (serviceId: string) => {
    onSelectServiceForBooking(serviceId);
    onNavigate('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const royalService = services.find((s) => s.id === 'royal-treatment');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
          Craft & Transparency
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white tracking-wide">
          SERVICES & BESPOKE PRICING
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base mt-4 font-light leading-relaxed">
          Every appointment includes a custom ergonomic consultation, hot botanical steam towels, precision razor detailing, and complimentary beverage selection from our private bar.
        </p>
      </div>

      {/* Featured Flagship Experience Hero Card */}
      {royalService && (
        <div className="relative rounded-2xl bg-gradient-to-br from-[#1a1810] via-[#15151a] to-[#121215] border-2 border-[#d4af37]/50 p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-xs font-semibold text-[#d4af37]">
                <Crown className="w-3.5 h-3.5" />
                <span className="uppercase tracking-widest text-[11px]">The Signature Crown Experience</span>
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
                {royalService.name}
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
                {royalService.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>Precision Haircut</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>Beard Sculpt or Shave</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>Peppermint Scalp Scrub</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>Volcanic Clay Facial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>Triple Hot Towel Steam</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>Single Malt Reserve</span>
                </div>
              </div>
            </div>

            <div className="lg:border-l lg:border-[#2a2a35] lg:pl-8 flex flex-col items-start lg:items-center justify-center space-y-4">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>{royalService.durationMinutes} Minutes Ritual</span>
              </div>

              <div className="text-left lg:text-center">
                <span className="text-xs uppercase tracking-widest text-zinc-400 block">Total Investment</span>
                <span className="font-cinzel text-4xl sm:text-5xl font-black text-gold-gradient">
                  ${royalService.price}
                </span>
              </div>

              <button
                onClick={() => handleBook(royalService.id)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89025] hover:from-[#e2c158] hover:to-[#c69d2f] text-[#0d0d10] font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#d4af37]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Book The Royal Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-xl bg-[#141419] border border-[#26262e]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b89025] text-[#0d0d10] shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-[#1a1a22]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl bg-[#141419] border border-[#25252d] hover:border-[#d4af37]/45 transition-all p-7 flex flex-col justify-between group shadow-xl hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                    {service.category.toUpperCase()}
                  </span>
                  {service.popular && (
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                      · Most Requested
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{service.durationMinutes} min</span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                  {service.name}
                </h3>
                <span className="font-cinzel text-2xl font-black text-gold-gradient shrink-0">
                  ${service.price}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-light mb-6">
                {service.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#22222a] flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                Includes hot towel finish & botanical styling
              </span>

              <button
                onClick={() => handleBook(service.id)}
                className="px-4 py-2 rounded-lg bg-[#1f1f28] hover:bg-[#d4af37] text-zinc-200 hover:text-[#0c0c0e] border border-[#d4af37]/30 hover:border-[#d4af37] font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Book This</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guest Lounge Policies */}
      <div className="rounded-2xl bg-[#111116] border border-[#24242c] p-8">
        <h3 className="font-cinzel text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span>The Crown & Blade Hospitality Promise</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-400">
          <div>
            <h4 className="font-semibold text-zinc-200 mb-1">Punctuality Guarantee</h4>
            <p className="leading-relaxed">
              We never double-book chairs. Your scheduled time is reserved exclusively for you with immediate seating.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-200 mb-1">Complimentary Bar</h4>
            <p className="leading-relaxed">
              Patrons over 21 may indulge in single malt scotch, chilled artisanal cold brew, espresso, or sparkling water upon arrival.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-200 mb-1">Bespoke Adjustments</h4>
            <p className="leading-relaxed">
              Every haircut includes a complimentary 7-day touchup for necklines and sideburns to keep your silhouette razor-sharp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
