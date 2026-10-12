import React, { useState } from 'react';
import { Crown, Scissors, Menu, X, ShieldAlert, Calendar, PhoneCall } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, isAdminLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services & Pricing' },
    { id: 'barbers', label: 'Master Barbers' },
    { id: 'booking', label: 'Contact & Booking' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-[#26262b]">
      {/* Top micro bar for phone & prestige tagline */}
      <div className="bg-[#121215] border-b border-[#1c1c22] text-xs text-zinc-400 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-[#d4af37] font-medium tracking-wider uppercase text-[10px]">
              The Sovereign Grooming Lounge
            </span>
            <span>·</span>
            <span>Est. 2018 · Heritage Craftsmanship & Savile Row Discipline</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="tel:+15559822300" className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors">
              <PhoneCall className="w-3 h-3 text-[#d4af37]" />
              <span>(555) 982-2300</span>
            </a>
            <span>·</span>
            <span>Mon–Sat 9AM–8PM · Sun 10AM–6PM</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3.5 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded-lg p-1"
          >
            <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-[#24242a] to-[#141418] border border-[#d4af37]/40 flex items-center justify-center shadow-lg group-hover:border-[#d4af37] transition-colors">
              <Crown className="w-5 h-5 text-[#d4af37] absolute -top-1 right-1 opacity-80" />
              <Scissors className="w-5 h-5 text-[#f5ecd5] rotate-[-45deg] transition-transform duration-300 group-hover:rotate-0" />
            </div>
            <div>
              <span className="font-cinzel text-xl tracking-[0.2em] font-extrabold text-white block leading-none">
                CROWN <span className="text-[#d4af37]">&</span> BLADE
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-400 block mt-1">
                Luxury Barbershop
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative text-sm tracking-wide font-medium transition-colors py-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#d4af37] ${
                    isActive ? 'text-[#d4af37]' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => handleLinkClick('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                currentTab === 'admin'
                  ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                  : 'border-zinc-800 bg-[#16161b] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
              title="Enter Admin Portal"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isAdminLoggedIn ? 'Admin Panel' : 'Staff Portal'}</span>
            </button>

            <button
              onClick={() => handleLinkClick('booking')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89025] hover:from-[#e1be48] hover:to-[#c69d2f] text-[#0f0f12] font-semibold text-xs tracking-wider uppercase shadow-lg shadow-[#d4af37]/15 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => handleLinkClick('booking')}
              className="px-3 py-1.5 rounded-md bg-[#d4af37] text-[#0f0f12] text-xs font-bold uppercase tracking-wider"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#d4af37]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#121216] border-b border-[#26262b] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                currentTab === link.id
                  ? 'bg-[#d4af37]/10 text-[#d4af37] font-semibold'
                  : 'text-zinc-300 hover:bg-[#1a1a20] hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 border-t border-[#26262b] flex flex-col gap-2">
            <button
              onClick={() => handleLinkClick('booking')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89025] text-[#0f0f12] font-bold text-xs uppercase tracking-wider"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Your Chair</span>
            </button>
            <button
              onClick={() => handleLinkClick('admin')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-zinc-800 bg-[#16161b] text-zinc-300 text-xs font-medium"
            >
              <ShieldAlert className="w-4 h-4 text-[#d4af37]" />
              <span>Staff / Admin Lounge</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
