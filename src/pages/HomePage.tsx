import React from 'react';
import { ServiceItem, BarberProfile, CustomerReview } from '../types';
import { ReviewsSlider } from '../components/ReviewsSlider';
import {
  Scissors,
  Crown,
  Sparkles,
  Shield,
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
  Wine,
  Flame,
} from 'lucide-react';

interface HomePageProps {
  services: ServiceItem[];
  barbers: BarberProfile[];
  reviews: CustomerReview[];
  onNavigate: (tab: string) => void;
  onSelectServiceForBooking?: (serviceId: string) => void;
  onSelectBarberForBooking?: (barberId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  services,
  barbers,
  reviews,
  onNavigate,
  onSelectServiceForBooking,
  onSelectBarberForBooking,
}) => {
  const featuredServices = services.slice(0, 3);

  const handleBookService = (serviceId: string) => {
    if (onSelectServiceForBooking) {
      onSelectServiceForBooking(serviceId);
    }
    onNavigate('booking');
  };

  const handleBookBarber = (barberId: string) => {
    if (onSelectBarberForBooking) {
      onSelectBarberForBooking(barberId);
    }
    onNavigate('booking');
  };

  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#222228] px-4 sm:px-6 lg:px-8 py-20">
        {/* Background dark gradients and atmospheric glow */}
        <div className="absolute inset-0 bg-[#0a0a0c] -z-20" />
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center -z-10 mix-blend-luminosity filter brightness-50"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1800&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/80 to-transparent -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#d4af37]/10 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Top subtle badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181f]/80 border border-[#d4af37]/40 text-xs font-medium text-[#d4af37] mb-8 shadow-xl">
            <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="tracking-widest uppercase text-[11px]">The Gold Standard of Modern Grooming</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-wider leading-[1.1] mb-6">
            PRECISION CRAFT.<br />
            <span className="text-gold-gradient">UNRIVALED DISTINCTION.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-zinc-300 text-base sm:text-xl font-light leading-relaxed mb-10">
            Welcome to Crown & Blade. A sanctuary reserved for gentlemen who command perfection in every cut, straight-razor discipline, and the restorative luxury of tailored grooming.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => onNavigate('booking')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e2c158] to-[#b89025] hover:from-[#e7c762] hover:to-[#c69d2f] text-[#0d0d10] font-bold text-sm uppercase tracking-widest shadow-xl shadow-[#d4af37]/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Reserve Your Chair</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('services')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#16161b] hover:bg-[#202026] border border-[#d4af37]/35 hover:border-[#d4af37] text-white font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore The Menu & Pricing</span>
            </button>
          </div>

          {/* Feature highlights bar */}
          <div className="mt-16 pt-10 border-t border-[#23232b] grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#15151a] border border-[#d4af37]/25 flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-white">Master Artisans</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">10+ Years Savile Experience</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#15151a] border border-[#d4af37]/25 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-white">Hot Towel Rituals</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Eucalyptus Steam & Alum</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#15151a] border border-[#d4af37]/25 flex items-center justify-center shrink-0">
                <Wine className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-white">Private Lounge</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Complimentary Single Malt</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#15151a] border border-[#d4af37]/25 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-white">Guaranteed Slot</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Zero Waiting Line Policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY & CRAFT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>The Philosophy</span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-wide leading-tight">
              MORE THAN A HAIRCUT.<br />
              AN INTENTIONAL RITUAL.
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
              Founded on the belief that a gentleman’s haircut is not an errand to be rushed, Crown & Blade offers an unhurried, private salon experience. Every appointment begins with an in-depth cranial and facial bone structure consultation to sculpt shapes that harmonize with your unique features.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <CheckCircle className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Japanese High-Carbon Steel Blades</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Micro-honed razor edges that glide effortlessly without drag or irritation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <CheckCircle className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Hand-Poured Botanical Tonics & Oils</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Organic cedarwood, bergamot, jojoba, and sandalwood concocted for maximum scalp and follicle nourishment.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <CheckCircle className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Single-Chair Privacy & Acoustic Harmony</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Designed with acoustic insulation, leather club armchairs, and relaxed curation.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('barbers')}
                className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#d4af37] hover:text-[#f3de8e] transition-colors group cursor-pointer"
              >
                <span>Discover Our Master Artisans</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=80"
                alt="Barber styling hair with straight razor"
                className="w-full h-[460px] object-cover object-center filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent" />
              
              {/* Floating aesthetic quote card */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#121217]/90 backdrop-blur-md border border-[#d4af37]/30">
                <p className="text-xs text-zinc-300 italic font-serif">
                  "A sharp silhouette inspires authority. We do not cut hair to look good today; we shape it so you carry confidence for weeks."
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#d4af37] font-semibold">
                  <span>Marcus Vance · Master Barber</span>
                  <span>Est. 2018</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
              Signature Menu
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-wide">
              CURATED GROOMING RITUALS
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-zinc-300 hover:text-[#d4af37] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View Full Menu ({services.length} Services)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl bg-[#141419] border border-[#26262e] hover:border-[#d4af37]/50 transition-all p-7 flex flex-col justify-between group shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
                    {service.category.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{service.durationMinutes} min</span>
                  </div>
                </div>

                <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors mb-3 leading-snug">
                  {service.name}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-6">
                  {service.description}
                </p>
              </div>

              <div className="pt-5 border-t border-[#22222a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 block">Investment</span>
                  <span className="font-cinzel text-2xl font-black text-gold-gradient">
                    ${service.price}
                  </span>
                </div>

                <button
                  onClick={() => handleBookService(service.id)}
                  className="px-4 py-2.5 rounded-lg bg-[#202028] hover:bg-[#d4af37] text-zinc-200 hover:text-[#0c0c0e] border border-[#d4af37]/30 hover:border-[#d4af37] font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEET THE BARBERS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
              Masters of the Craft
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-wide">
              RESIDENT ARTISANS
            </h2>
          </div>
          <button
            onClick={() => onNavigate('barbers')}
            className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-zinc-300 hover:text-[#d4af37] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All Profiles & Schedules</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="rounded-2xl bg-[#141419] border border-[#26262e] hover:border-[#d4af37]/50 overflow-hidden shadow-xl transition-all group hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={barber.avatar}
                  alt={barber.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-[#141419]/20 to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#0c0c0e]/80 backdrop-blur-md border border-[#d4af37]/30 text-[11px] text-[#d4af37] font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#d4af37]" />
                  <span>{barber.rating}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors">
                    {barber.name}
                  </h3>
                  <p className="text-xs text-[#d4af37]/90 font-medium mt-0.5">
                    {barber.role}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2">
                    {barber.specialty}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#22222a]">
                  <button
                    onClick={() => handleBookBarber(barber.id)}
                    className="w-full py-2 rounded-lg bg-[#1a1a22] hover:bg-[#d4af37] text-zinc-300 hover:text-[#0c0c0e] border border-[#30303c] hover:border-[#d4af37] font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer"
                  >
                    Select Barber
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC CUSTOMER REVIEWS SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
            Client Testimonials
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-wide">
            WORDS FROM OUR GUESTS
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-3 font-light">
            Verified experiences from discerning patrons who value precision, punctuality, and unparalleled ambiance.
          </p>
        </div>

        <ReviewsSlider reviews={reviews} />
      </section>

      {/* BOOKING CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#181820] via-[#1f1a14] to-[#181820] border border-[#d4af37]/40 p-8 sm:p-14 overflow-hidden shadow-2xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-bold block mb-2">
              Ready For Transformation?
            </span>
            <h3 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white tracking-wide leading-tight">
              RESERVE YOUR APPOINTMENT IN UNDER 60 SECONDS
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-3 font-light leading-relaxed">
              Select your preferred service, artisan, and exact calendar slot. Walk in directly to your private grooming chair without waiting.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('booking')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89025] hover:from-[#e1be48] hover:to-[#c69d2f] text-[#0d0d10] font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#d4af37]/20 transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              Book An Appointment Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
