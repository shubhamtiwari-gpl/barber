import React from 'react';
import { Crown, Scissors, MapPin, Phone, Mail, Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#09090b] border-t border-[#1f1f24] text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#18181e] border border-[#d4af37]/40 flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#d4af37]" />
              </div>
              <span className="font-cinzel text-lg tracking-[0.2em] font-extrabold text-white">
                CROWN & BLADE
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              A private grooming sanctuary built on old-world craftsmanship, razor discipline, and modern gentleman luxury. Tailored shears, artisan oils, and bespoke service.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#141418] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors"
                aria-label="Instagram"
              >
                <span className="text-xs font-bold">IG</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#141418] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors"
                aria-label="X / Twitter"
              >
                <span className="text-xs font-bold">X</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#141418] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors"
                aria-label="Facebook"
              >
                <span className="text-xs font-bold">FB</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-sm uppercase tracking-wider text-white font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Bespoke Services & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('barbers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Meet Our Master Barbers
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Online Appointment Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-[#d4af37] transition-colors"
                >
                  <ShieldAlert className="w-3 h-3 text-[#d4af37]" />
                  <span>Admin Management Panel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Lounge Hours */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-sm uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d4af37]" />
              <span>Lounge Hours</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#181820]">
                <span>Monday – Friday</span>
                <span className="text-white font-medium">9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#181820]">
                <span>Saturday</span>
                <span className="text-white font-medium">9:00 AM – 7:00 PM</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Sunday</span>
                <span className="text-[#d4af37] font-medium">10:00 AM – 5:00 PM</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 italic">
              Walk-ins warmly welcomed subject to chair availability; priority reservations recommended.
            </p>
          </div>

          {/* Concierge Contact */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-sm uppercase tracking-wider text-white font-bold">
              The Sanctuary
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>442 St. Clair Avenue, Suite 100, Heritage District, NY 10019</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href="tel:+15559822300" className="hover:text-white transition-colors">
                  (555) 982-2300
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href="mailto:concierge@crownandblade.com" className="hover:text-white transition-colors">
                  concierge@crownandblade.com
                </a>
              </div>
            </div>

            <button
              onClick={() => { onNavigate('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#191920] border border-[#d4af37]/40 hover:border-[#d4af37] text-white hover:text-[#d4af37] transition-all text-xs font-semibold uppercase tracking-wider"
            >
              <span>Reserve A Seat</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#d4af37]" />
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-14 pt-8 border-t border-[#181820] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <div>
            © {new Date().getFullYear()} Crown & Blade Grooming Lounge. All rights reserved. Built for production deployment on Render.
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Node.js & SQLite</span>
            <span>·</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-zinc-400 hover:text-[#d4af37] transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
