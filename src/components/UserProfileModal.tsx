import React, { useState, useEffect } from 'react';
import { UserProfile, Appointment } from '../types';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Scissors,
  CheckCircle2,
  XCircle,
  X,
  LogOut,
  Sparkles,
  Edit3,
  Save,
  PlusCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onNavigateToBooking: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onNavigateToBooking,
  showToast,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'edit'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edit states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [preferredService, setPreferredService] = useState(user?.preferred_service || '');
  const [preferredBarber, setPreferredBarber] = useState(user?.preferred_barber || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPreferredService(user.preferred_service || '');
      setPreferredBarber(user.preferred_barber || '');
    }
  }, [user]);

  // Fetch live user profile and bookings
  const fetchProfileAndBookings = async () => {
    const token = localStorage.getItem('cb_user_token');
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        onLogout();
        showToast('error', 'Session Expired', 'कृपया पुनः लॉगिन करें / Please login again.');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
        if (data.user) {
          onUpdateUser(data.user);
        }
      }
    } catch (err) {
      console.error('Error fetching user appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchProfileAndBookings();
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('cb_user_token');
    if (!token) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          preferred_service: preferredService.trim(),
          preferred_barber: preferredBarber.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update profile');

      onUpdateUser(data.user);
      localStorage.setItem('cb_user_profile', JSON.stringify(data.user));
      showToast('success', 'अपडेट सफल / Profile Updated', 'आपकी प्रोफ़ाइल जानकारी सुरक्षित सेव हो गई है।');
      setActiveTab('appointments');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('क्या आप सचमुच इस अपॉइंटमेंट को रद्द करना चाहते हैं? / Cancel this appointment?')) {
      return;
    }

    const token = localStorage.getItem('cb_user_token');
    if (!token) return;

    try {
      const response = await fetch(`/api/user/appointments/${appointmentId}/cancel`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Cancellation failed');

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt))
      );
      showToast('info', 'अपॉइंटमेंट रद्द / Cancelled', 'आपकी बुकिंग सफलतापूर्वक रद्द कर दी गई है।');
    } catch (err: any) {
      showToast('error', 'Error', err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#131317] border border-[#2e2e38] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Profile Band */}
        <div className="bg-gradient-to-r from-[#1b1b24] via-[#1f1a14] to-[#1b1b24] p-6 sm:p-8 border-b border-[#2b2b36] relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2a271c] to-[#17171d] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] font-cinzel text-2xl font-black shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                    {user.name || 'Valued Patron'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider">
                    VIP Member
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#d4af37]" />
                    {user.phone}
                  </span>
                  {user.email && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>लॉगआउट / Logout</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-3 mt-6 pt-2 border-t border-[#292934]">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'appointments'
                  ? 'bg-[#d4af37] text-[#0d0d10]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>मेरी बुकिंग / My Appointments ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'edit'
                  ? 'bg-[#d4af37] text-[#0d0d10]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>प्रोफ़ाइल विवरण / Edit Profile</span>
            </button>

            <button
              onClick={fetchProfileAndBookings}
              disabled={isLoading}
              className="ml-auto p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#d4af37]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'appointments' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  Scheduled Appointments in Database
                </span>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToBooking();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89025] text-[#0d0d10] font-bold text-xs uppercase tracking-wider shadow-sm hover:from-[#e2c158] transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Book New Chair</span>
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="rounded-2xl bg-[#17171e] border border-[#252530] p-8 text-center space-y-3">
                  <Scissors className="w-10 h-10 text-[#d4af37] mx-auto opacity-70" />
                  <h3 className="font-cinzel text-base font-bold text-white">
                    अभी कोई अपॉइंटमेंट नहीं मिला
                  </h3>
                  <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">
                    इस मोबाइल नंबर ({user.phone}) से कोई बुकिंग दर्ज नहीं है। नीचे दिए गए बटन से अपनी पहली चेयर बुक करें।
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToBooking();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#0d0d10] font-bold text-xs uppercase tracking-wider hover:bg-[#e4be45] transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Reserve An Appointment</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="rounded-2xl bg-[#17171e] border border-[#262632] p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-cinzel text-base font-bold text-white">
                            {apt.service_name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              apt.status === 'confirmed'
                                ? 'bg-blue-950/80 border border-blue-500/50 text-blue-300'
                                : apt.status === 'completed'
                                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                                : 'bg-zinc-800 text-zinc-400 line-through'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1 text-white font-medium">
                            <Calendar className="w-3 h-3 text-[#d4af37]" />
                            {apt.date}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-[#d4af37] font-semibold">
                            <Clock className="w-3 h-3" />
                            {apt.time}
                          </span>
                          <span>·</span>
                          <span>Artisan: {apt.barber_name}</span>
                        </div>

                        {apt.notes && (
                          <p className="text-[11px] text-zinc-400 italic pt-1">
                            Note: "{apt.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-[#252530] pt-3 sm:pt-0">
                        <span className="font-cinzel text-lg font-black text-gold-gradient">
                          ${apt.service_price}
                        </span>

                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            रद्द करें / Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* EDIT PROFILE FORM */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    पूरा नाम / Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    ईमेल / Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    पसंदीदा नाई / Preferred Barber
                  </label>
                  <input
                    type="text"
                    value={preferredBarber}
                    onChange={(e) => setPreferredBarber(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    पसंदीदा सर्विस / Preferred Service
                  </label>
                  <input
                    type="text"
                    value={preferredService}
                    onChange={(e) => setPreferredService(e.target.value)}
                    placeholder="e.g. The Crown Royal Experience"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#17171e] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89025] text-[#0d0d10] font-bold text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'सेव हो रहा है...' : 'प्रोफ़ाइल सेव करें / Save Changes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
