import React, { useState, useEffect } from 'react';
import { ServiceItem, BarberProfile, Appointment } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Send,
  Sparkles,
  ShieldCheck,
  Printer,
  RotateCcw,
  Navigation,
} from 'lucide-react';

interface BookingPageProps {
  services: ServiceItem[];
  barbers: BarberProfile[];
  initialServiceId?: string;
  initialBarberId?: string;
  onAppointmentBooked?: (appointment: Appointment) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  services,
  barbers,
  initialServiceId,
  initialBarberId,
  onAppointmentBooked,
  showToast,
}) => {
  // Appointment Form States
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || (services[0]?.id || 'gentlemans-cut'));
  const [selectedBarberId, setSelectedBarberId] = useState<string>(initialBarberId || (barbers[0]?.id || 'marcus-vance'));
  
  // Default to tomorrow or today
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(getTomorrowDate());
  const [time, setTime] = useState<string>('11:00 AM');
  const [customerName, setCustomerName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState<boolean>(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Contact Form States
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactSubject, setContactSubject] = useState<string>('General Inquiries');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [isSubmittingContact, setIsSubmittingContact] = useState<boolean>(false);
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);

  // Available Time Slots
  const timeSlots = [
    '09:30 AM',
    '10:30 AM',
    '11:30 AM',
    '01:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
  ];

  // Sync if initial props change
  useEffect(() => {
    if (initialServiceId) setSelectedServiceId(initialServiceId);
  }, [initialServiceId]);

  useEffect(() => {
    if (initialBarberId) setSelectedBarberId(initialBarberId);
  }, [initialBarberId]);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedBarber = barbers.find((b) => b.id === selectedBarberId) || barbers[0];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !email.trim() || !phone.trim() || !date || !time) {
      showToast('error', 'Missing Information', 'Please complete all required fields.');
      return;
    }

    setIsSubmittingBooking(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          email,
          phone,
          service_id: selectedService?.id || 'custom',
          service_name: selectedService?.name || 'Custom Grooming',
          service_price: selectedService?.price || 55,
          barber_id: selectedBarber?.id || 'any',
          barber_name: selectedBarber ? `${selectedBarber.name} (${selectedBarber.role})` : 'Master Barber',
          date,
          time,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete booking');
      }

      setConfirmedAppointment(data.appointment);
      showToast('success', 'Appointment Reserved!', `We look forward to hosting you on ${date} at ${time}.`);

      if (onAppointmentBooked) {
        onAppointmentBooked(data.appointment);
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      showToast('error', 'Reservation Failed', err.message || 'Unable to save appointment to database.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      showToast('error', 'Incomplete Form', 'Please fill in your name, email, and message.');
      return;
    }

    setIsSubmittingContact(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          subject: contactSubject,
          message: contactMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
      showToast('success', 'Message Received', 'Our concierge desk has received your request and will reply promptly.');
    } catch (err: any) {
      console.error('Contact error:', err);
      showToast('error', 'Dispatch Error', err.message || 'Unable to deliver message.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const resetBookingForm = () => {
    setConfirmedAppointment(null);
    setCustomerName('');
    setNotes('');
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
          Concierge & Reservations
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white tracking-wide">
          CONTACT & APPOINTMENT BOOKING
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base mt-4 font-light leading-relaxed">
          Reserve your private grooming chair in real time or get in touch with our front desk for bespoke event buyouts, custom grooming packages, or questions.
        </p>
      </div>

      {/* SECTION 1: APPOINTMENT BOOKING FORM */}
      <section className="scroll-mt-28" id="booking-section">
        <div className="rounded-3xl bg-[#131317] border border-[#2b2b34] overflow-hidden shadow-2xl">
          <div className="bg-[#181820] border-b border-[#252530] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#24242a] to-[#141418] border border-[#d4af37]/40 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                  ONLINE APPOINTMENT RESERVATION
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Saved directly to database · Immediate calendar reservation confirmation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
              <span>Real-Time Database Sync</span>
            </div>
          </div>

          {confirmedAppointment ? (
            /* CONFIRMATION PASS / RECEIPT */
            <div className="p-8 sm:p-14 max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border-2 border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                  Reservation Confirmed
                </span>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
                  WE AWAIT YOUR ARRIVAL, {confirmedAppointment.customer_name.split(' ')[0].toUpperCase()}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 font-light">
                  A confirmation has been logged with reference ID <span className="text-[#d4af37] font-mono font-bold">{confirmedAppointment.id}</span>.
                </p>
              </div>

              {/* Digital Pass Ticket */}
              <div className="rounded-2xl bg-[#191922] border-2 border-[#d4af37]/40 p-6 sm:p-8 text-left space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl" />

                <div className="flex items-center justify-between border-b border-[#292934] pb-4">
                  <div>
                    <span className="font-cinzel text-lg font-bold text-white tracking-widest block">
                      CROWN & BLADE
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                      Gentleman's Pass
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
                    {confirmedAppointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Service</span>
                    <span className="font-semibold text-white text-sm">{confirmedAppointment.service_name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Master Artisan</span>
                    <span className="font-semibold text-white text-sm">{confirmedAppointment.barber_name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Date</span>
                    <span className="font-semibold text-white text-sm">{confirmedAppointment.date}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Scheduled Time</span>
                    <span className="font-semibold text-[#d4af37] text-sm">{confirmedAppointment.time}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Guest Phone</span>
                    <span className="font-medium text-zinc-200">{confirmedAppointment.phone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Total Due</span>
                    <span className="font-cinzel font-bold text-base text-gold-gradient">${confirmedAppointment.service_price}</span>
                  </div>
                </div>

                {confirmedAppointment.notes && (
                  <div className="pt-3 border-t border-[#292934] text-xs">
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider mb-0.5">Special Requests</span>
                    <p className="text-zinc-300 italic font-light">"{confirmedAppointment.notes}"</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#202028] hover:bg-[#2b2b36] border border-zinc-700 text-zinc-200 text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={resetBookingForm}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89025] text-[#0d0d10] text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/15 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Book Another Chair</span>
                </button>
              </div>
            </div>
          ) : (
            /* BOOKING INPUT FORM */
            <form onSubmit={handleBookingSubmit} className="p-6 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left 2 Columns: Steps */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Step 1: Select Service */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0c0c0e] font-bold text-xs flex items-center justify-center font-mono">
                        1
                      </span>
                      <label className="font-cinzel text-base font-bold text-white tracking-wide">
                        CHOOSE YOUR GROOMING RITUAL
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {services.map((svc) => (
                        <button
                          type="button"
                          key={svc.id}
                          onClick={() => setSelectedServiceId(svc.id)}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            selectedServiceId === svc.id
                              ? 'bg-[#1e1c15] border-[#d4af37] shadow-lg shadow-[#d4af37]/10 ring-1 ring-[#d4af37]'
                              : 'bg-[#16161c] border-[#262630] hover:border-zinc-600'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                                {svc.category} · {svc.durationMinutes} min
                              </span>
                              <span className="font-cinzel text-base font-bold text-gold-gradient">
                                ${svc.price}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white leading-snug">
                              {svc.name}
                            </h4>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Select Barber */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0c0c0e] font-bold text-xs flex items-center justify-center font-mono">
                        2
                      </span>
                      <label className="font-cinzel text-base font-bold text-white tracking-wide">
                        CHOOSE MASTER ARTISAN
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {barbers.map((barber) => (
                        <button
                          type="button"
                          key={barber.id}
                          onClick={() => setSelectedBarberId(barber.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                            selectedBarberId === barber.id
                              ? 'bg-[#1e1c15] border-[#d4af37] shadow-lg shadow-[#d4af37]/10 ring-1 ring-[#d4af37]'
                              : 'bg-[#16161c] border-[#262630] hover:border-zinc-600'
                          }`}
                        >
                          <img
                            src={barber.avatar}
                            alt={barber.name}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 filter brightness-95"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">
                              {barber.name}
                            </h4>
                            <p className="text-[11px] text-[#d4af37] font-medium truncate">
                              {barber.role}
                            </p>
                            <span className="text-[10px] text-zinc-400 block truncate mt-0.5">
                              {barber.experienceYears}y exp · ★ {barber.rating}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Date & Time */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0c0c0e] font-bold text-xs flex items-center justify-center font-mono">
                        3
                      </span>
                      <label className="font-cinzel text-base font-bold text-white tracking-wide">
                        DATE & APPOINTMENT TIME
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Desired Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            min={todayStr}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Select Chair Slot
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTime(slot)}
                              className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                                time === slot
                                  ? 'bg-[#d4af37] text-[#0d0d10] border-[#d4af37] font-bold'
                                  : 'bg-[#17171e] text-zinc-300 border-[#2b2b36] hover:border-zinc-500'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Client Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0c0c0e] font-bold text-xs flex items-center justify-center font-mono">
                        4
                      </span>
                      <label className="font-cinzel text-base font-bold text-white tracking-wide">
                        GUEST DETAILS
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Christian Grey"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="client@luxury.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                        Special Requests or Preferences (Optional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Skin sensitivity, preference for espresso / scotch, beard length details"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Booking Summary & Submission */}
                <div className="lg:border-l lg:border-[#262632] lg:pl-8 flex flex-col justify-between space-y-6">
                  <div className="rounded-2xl bg-[#17171f] border border-[#d4af37]/30 p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-[#252530] pb-3">
                      <h4 className="font-cinzel text-sm font-bold text-white tracking-wider">
                        CHAIR RESERVATION SUMMARY
                      </h4>
                      <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Selected Service</span>
                        <span className="font-semibold text-white">{selectedService?.name}</span>
                        <span className="text-zinc-400 text-[11px] block mt-0.5">{selectedService?.durationMinutes} min appointment</span>
                      </div>

                      <div className="pt-2 border-t border-[#22222a]">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Assigned Artisan</span>
                        <span className="font-semibold text-white">{selectedBarber?.name}</span>
                        <span className="text-[#d4af37] text-[11px] block">{selectedBarber?.role}</span>
                      </div>

                      <div className="pt-2 border-t border-[#22222a]">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Date & Time</span>
                        <span className="font-semibold text-white">{date || 'Select date'} at {time}</span>
                      </div>

                      <div className="pt-3 border-t border-[#22222a] flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider text-zinc-300 font-bold">Total Service Fee</span>
                        <span className="font-cinzel text-2xl font-black text-gold-gradient">
                          ${selectedService?.price || 0}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 italic leading-normal">
                      Payment is completed at the lounge upon completion of your ritual. No deposit required.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89025] hover:from-[#e2c158] hover:to-[#c69d2f] text-[#0d0d10] font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#d4af37]/20 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmittingBooking ? (
                      <span>Saving Reservation to DB...</span>
                    ) : (
                      <>
                        <Scissors className="w-4 h-4" />
                        <span>Confirm & Reserve Chair</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* SECTION 2: CONTACT FORM & LOUNGE DIRECTORY */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Working Contact Form */}
        <div className="rounded-3xl bg-[#131317] border border-[#2b2b34] p-8 sm:p-10 shadow-2xl space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
              Direct Concierge Desk
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              SEND A MESSAGE
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-light leading-relaxed">
              Have a special inquiry regarding private salon buyouts, wedding parties, or product orders? Leave us a message.
            </p>
          </div>

          {contactSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Thank you. Your message has been saved to our inbox. Our concierge will follow up promptly.</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Lord / Mr. Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="concierge@guest.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Subject *
                </label>
                <select
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                >
                  <option value="General Inquiries">General Inquiries</option>
                  <option value="Private Buyout / Wedding Grooming">Private Buyout / Wedding Grooming</option>
                  <option value="Product & Grooming Oil Inquiries">Product & Grooming Oil Inquiries</option>
                  <option value="Feedback & Press">Feedback & Press</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Your Message *
              </label>
              <textarea
                required
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="How may our barbershop team be of service to you?"
                className="w-full px-4 py-3 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingContact}
              className="w-full py-3.5 rounded-xl bg-[#1e1e26] hover:bg-[#d4af37] text-zinc-200 hover:text-[#0c0c0e] border border-[#d4af37]/40 hover:border-[#d4af37] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmittingContact ? (
                <span>Dispatching Message...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#d4af37]" />
                  <span>Send Message To Concierge</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Location, Map & Shop Hours */}
        <div className="space-y-8">
          {/* Shop Hours Card */}
          <div className="rounded-3xl bg-[#131317] border border-[#2b2b34] p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#d4af37]">
              <Clock className="w-5 h-5" />
              <h3 className="font-cinzel text-lg font-bold text-white tracking-wider">
                CHAIR HOURS & ADMISSION
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#21212b]">
                <span className="text-zinc-400">Monday – Thursday</span>
                <span className="text-white font-medium">9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#21212b]">
                <span className="text-zinc-400">Friday</span>
                <span className="text-white font-medium">8:30 AM – 8:30 PM (Late Lounge)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#21212b]">
                <span className="text-zinc-400">Saturday</span>
                <span className="text-white font-medium">9:00 AM – 7:00 PM</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-400">Sunday</span>
                <span className="text-[#d4af37] font-medium">10:00 AM – 5:00 PM (Acoustic Sunday)</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-zinc-400 leading-relaxed border-t border-[#21212b]">
              Valet parking available at the building front drive on St. Clair Avenue.
            </div>
          </div>

          {/* Interactive Visual Map Placeholder */}
          <div className="rounded-3xl bg-[#131317] border border-[#2b2b34] overflow-hidden shadow-xl">
            <div className="relative h-60 bg-[#0d0d11] overflow-hidden flex items-center justify-center p-6 text-center">
              {/* Map grid aesthetic */}
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center filter contrast-125"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-[#0d0d11]/80 backdrop-blur-[2px]" />

              <div className="relative z-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#181820] border-2 border-[#d4af37] flex items-center justify-center mx-auto shadow-lg text-[#d4af37]">
                  <MapPin className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-white tracking-widest">
                    CROWN & BLADE GROOMING LOUNGE
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1">
                    442 St. Clair Avenue, Suite 100, Heritage District
                  </p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#d4af37] text-[#0d0d10] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#e4be45] transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Driving Directions</span>
                </a>
              </div>
            </div>

            <div className="p-5 bg-[#171720] border-t border-[#23232c] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 gap-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <a href="tel:+15559822300" className="text-white hover:text-[#d4af37] font-medium">
                  Direct Line: (555) 982-2300
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <a href="mailto:concierge@crownandblade.com" className="text-white hover:text-[#d4af37] font-medium">
                  concierge@crownandblade.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
