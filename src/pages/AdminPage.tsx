import React, { useState, useEffect, useCallback } from 'react';
import { Appointment, ContactMessage, AdminStats } from '../types';
import {
  ShieldAlert,
  Lock,
  User,
  Calendar,
  MessageSquare,
  DollarSign,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  LogOut,
  Mail,
  Phone,
  Clock,
  Sparkles,
  Scissors,
  Check,
  Archive,
  ExternalLink,
  PlusCircle,
  Database,
} from 'lucide-react';

interface AdminPageProps {
  onBackToClientSite: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  onAdminAuthChange?: (isLoggedIn: boolean) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onBackToClientSite,
  showToast,
  onAdminAuthChange,
}) => {
  // Auth state
  const [token, setToken] = useState<string>(() => localStorage.getItem('cb_admin_token') || '');
  const [adminUsername, setAdminUsername] = useState<string>('admin');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState<'appointments' | 'messages' | 'walkin'>('appointments');

  // Data states
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalBookingsToday: 0,
    totalBookings: 0,
    pendingMessages: 0,
    completedBookings: 0,
    totalRevenue: 0,
  });

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [appointmentFilter, setAppointmentFilter] = useState<string>('all');
  const [appointmentSearch, setAppointmentSearch] = useState<string>('');
  const [messageFilter, setMessageFilter] = useState<string>('all');

  // Walk-in booking state
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinService, setWalkinService] = useState('Gentleman\'s Signature Precision Cut');
  const [walkinPrice, setWalkinPrice] = useState(55);
  const [walkinBarber, setWalkinBarber] = useState('Marcus Vance (Master Barber)');
  const [walkinDate, setWalkinDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [walkinTime, setWalkinTime] = useState('02:00 PM');
  const [walkinNotes, setWalkinNotes] = useState('Walk-in reception booking');
  const [isSubmittingWalkin, setIsSubmittingWalkin] = useState(false);

  // Sync auth status with parent
  useEffect(() => {
    if (onAdminAuthChange) {
      onAdminAuthChange(Boolean(token));
    }
  }, [token, onAdminAuthChange]);

  // Fetch admin dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;

    setIsLoadingData(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [aptRes, msgRes, statsRes] = await Promise.all([
        fetch('/api/admin/appointments', { headers }),
        fetch('/api/admin/messages', { headers }),
        fetch('/api/admin/stats', { headers }),
      ]);

      if (aptRes.status === 401 || msgRes.status === 401) {
        handleLogout();
        showToast('error', 'Session Expired', 'Please re-authenticate with the admin credentials.');
        return;
      }

      if (aptRes.ok) {
        const aptData = await aptRes.json();
        setAppointments(aptData);
      }

      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      showToast('error', 'Sync Failure', 'Could not refresh data from database.');
    } finally {
      setIsLoadingData(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, fetchDashboardData]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminUsername,
          password: adminPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      localStorage.setItem('cb_admin_token', data.token);
      setToken(data.token);
      showToast('success', 'Admin Authenticated', `Welcome back, ${data.admin?.name || 'Administrator'}.`);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
      showToast('error', 'Access Denied', err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cb_admin_token');
    setToken('');
    setAppointments([]);
    setMessages([]);
    showToast('info', 'Logged Out', 'Admin session has been terminated.');
  };

  const handleFillDemoCreds = () => {
    setAdminUsername('admin');
    setAdminPassword('crownblade2026');
  };

  // Appointment Actions
  const handleUpdateAppointmentStatus = async (id: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Status update failed');

      // Optimistic update
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
      );

      showToast('success', 'Status Updated', `Appointment marked as ${newStatus}.`);
      fetchDashboardData();
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment from the database?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');

      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      showToast('success', 'Record Deleted', 'Appointment has been purged from SQLite database.');
      fetchDashboardData();
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message);
    }
  };

  // Message Actions
  const handleUpdateMessageStatus = async (id: string, newStatus: 'unread' | 'replied' | 'archived') => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Update failed');

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );

      showToast('success', 'Message Updated', `Message marked as ${newStatus}.`);
      fetchDashboardData();
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message from database?')) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      showToast('success', 'Message Deleted', 'Message deleted from database.');
      fetchDashboardData();
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message);
    }
  };

  // Walk-in booking submission from admin
  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone) {
      showToast('error', 'Missing details', 'Please specify guest name and phone number.');
      return;
    }

    setIsSubmittingWalkin(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: walkinName,
          email: walkinEmail || 'walkin@crownblade.lounge',
          phone: walkinPhone,
          service_id: 'walkin',
          service_name: walkinService,
          service_price: walkinPrice,
          barber_id: 'staff',
          barber_name: walkinBarber,
          date: walkinDate,
          time: walkinTime,
          notes: walkinNotes,
        }),
      });

      if (!res.ok) throw new Error('Failed to register walk-in');

      showToast('success', 'Walk-In Scheduled', `${walkinName} added to the chair schedule.`);
      setWalkinName('');
      setWalkinPhone('');
      setWalkinEmail('');
      setActiveTab('appointments');
      fetchDashboardData();
    } catch (err: any) {
      showToast('error', 'Failed', err.message);
    } finally {
      setIsSubmittingWalkin(false);
    }
  };

  // Filtering
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus =
      appointmentFilter === 'all' || apt.status === appointmentFilter;
    const matchesSearch =
      appointmentSearch === '' ||
      apt.customer_name.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.phone.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.service_name.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.barber_name.toLowerCase().includes(appointmentSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredMessages = messages.filter((msg) => {
    if (messageFilter === 'all') return true;
    return msg.status === messageFilter;
  });

  // IF NOT AUTHENTICATED: SHOW SECURE LOGIN PAGE
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl bg-[#131317] border border-[#2b2b34] p-8 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#181820] border-2 border-[#d4af37]/50 flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-7 h-7 text-[#d4af37]" />
            </div>

            <h1 className="font-cinzel text-2xl font-extrabold text-white tracking-widest">
              ADMINISTRATIVE LOUNGE
            </h1>
            <p className="text-xs text-zinc-400 font-light">
              Restricted management portal for Crown & Blade master concierge.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#181820] border border-[#2c2c36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                />
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Secret Access Key / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#181820] border border-[#2c2c36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89025] hover:from-[#e2c158] hover:to-[#c69d2f] text-[#0d0d10] font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#d4af37]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'Authenticating...' : 'Unlock Admin Portal'}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="pt-4 border-t border-[#23232c] flex flex-col gap-3 text-center">
            <button
              type="button"
              onClick={handleFillDemoCreds}
              className="text-xs text-[#d4af37] hover:underline cursor-pointer"
            >
              Click to autofill default credentials (admin / crownblade2026)
            </button>

            <button
              onClick={onBackToClientSite}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ← Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252530] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Master Concierge Terminal</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-400 font-mono text-[11px]">Render Node.js + SQLite</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white tracking-wide mt-1">
            EXECUTIVE CONTROL DASHBOARD
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={isLoadingData}
            className="p-2.5 rounded-xl bg-[#181820] border border-zinc-700 hover:border-[#d4af37] text-zinc-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Database Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-[#d4af37]' : ''}`} />
          </button>

          <button
            onClick={onBackToClientSite}
            className="px-4 py-2.5 rounded-xl bg-[#181820] border border-zinc-700 hover:border-zinc-500 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-800/40 text-red-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Bookings Today */}
        <div className="rounded-2xl bg-[#141419] border border-[#25252e] p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
              Total Bookings Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1e1c15] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-3xl font-black text-white">
            {stats.totalBookingsToday}
          </div>
          <p className="text-[11px] text-[#d4af37] mt-1 font-medium">
            Active reservations for today
          </p>
        </div>

        {/* Pending Messages */}
        <div className="rounded-2xl bg-[#141419] border border-[#25252e] p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
              Pending Messages
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-3xl font-black text-white">
            {stats.pendingMessages}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Unread customer inquiries
          </p>
        </div>

        {/* Completed Services */}
        <div className="rounded-2xl bg-[#141419] border border-[#25252e] p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
              Completed Appointments
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-3xl font-black text-white">
            {stats.completedBookings}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Out of {stats.totalBookings} total bookings
          </p>
        </div>

        {/* Revenue */}
        <div className="rounded-2xl bg-[#141419] border border-[#25252e] p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
              Total Booking Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1e1c15] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-3xl font-black text-gold-gradient">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            From scheduled & completed chairs
          </p>
        </div>
      </div>

      {/* DASHBOARD TABS NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252530] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'appointments'
                ? 'bg-[#d4af37] text-[#0d0d10] shadow-md shadow-[#d4af37]/20'
                : 'bg-[#16161c] text-zinc-400 hover:text-white'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Appointments ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-[#d4af37] text-[#0d0d10] shadow-md shadow-[#d4af37]/20'
                : 'bg-[#16161c] text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages ({messages.length})</span>
            {stats.pendingMessages > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-mono">
                {stats.pendingMessages}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('walkin')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'walkin'
                ? 'bg-[#d4af37] text-[#0d0d10] shadow-md shadow-[#d4af37]/20'
                : 'bg-[#16161c] text-zinc-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Walk-In</span>
          </button>
        </div>

        {/* Database status pill */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Database className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Storage: <strong className="text-zinc-200">barbershop.sqlite</strong> (ACID)</span>
        </div>
      </div>

      {/* TAB 1: APPOINTMENTS TABLE */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Controls: Search and Status Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search guest, phone, or service..."
                value={appointmentSearch}
                onChange={(e) => setAppointmentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#16161c] border border-[#262630] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-zinc-500 uppercase tracking-wider shrink-0">Filter:</span>
              {['all', 'confirmed', 'completed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setAppointmentFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                    appointmentFilter === st
                      ? 'bg-[#282834] text-[#d4af37] border border-[#d4af37]/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl bg-[#131317] border border-[#25252e] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#181820] border-b border-[#252530] text-zinc-400 font-cinzel text-[11px] tracking-wider uppercase">
                    <th className="py-4 px-6">Guest & Contact</th>
                    <th className="py-4 px-6">Service Ritual</th>
                    <th className="py-4 px-6">Master Artisan</th>
                    <th className="py-4 px-6">Date & Time</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202028]">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500">
                        No appointments found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr
                        key={apt.id}
                        className="hover:bg-[#181822]/60 transition-colors group"
                      >
                        {/* Guest & Contact */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white text-sm">
                            {apt.customer_name}
                          </div>
                          <div className="text-zinc-400 text-[11px] mt-0.5 flex flex-col gap-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#d4af37]" />
                              {apt.phone}
                            </span>
                            <span className="flex items-center gap-1 text-zinc-500">
                              <Mail className="w-3 h-3" />
                              {apt.email}
                            </span>
                          </div>
                        </td>

                        {/* Service & Price */}
                        <td className="py-4 px-6">
                          <div className="text-zinc-200 font-medium">
                            {apt.service_name}
                          </div>
                          <div className="font-cinzel text-sm font-bold text-gold-gradient mt-0.5">
                            ${apt.service_price}
                          </div>
                          {apt.notes && (
                            <div className="text-[11px] text-zinc-400 italic mt-1 max-w-xs truncate" title={apt.notes}>
                              Note: "{apt.notes}"
                            </div>
                          )}
                        </td>

                        {/* Master Barber */}
                        <td className="py-4 px-6 text-zinc-300">
                          <div className="font-medium text-white">{apt.barber_name}</div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-medium text-white">{apt.date}</div>
                          <div className="text-[#d4af37] font-semibold text-[11px] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {apt.time}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          {apt.status === 'confirmed' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-300 font-semibold text-[10px] uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              Confirmed
                            </span>
                          )}
                          {apt.status === 'completed' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold text-[10px] uppercase tracking-wider">
                              <Check className="w-3 h-3 text-emerald-400" />
                              Completed
                            </span>
                          )}
                          {apt.status === 'cancelled' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-semibold text-[10px] uppercase tracking-wider line-through">
                              Cancelled
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {apt.status !== 'completed' && (
                              <button
                                onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}
                                className="p-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 transition-colors cursor-pointer"
                                title="Mark as Completed"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {apt.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateAppointmentStatus(apt.id, 'cancelled')}
                                className="p-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 transition-colors cursor-pointer"
                                title="Cancel Appointment"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {apt.status === 'cancelled' && (
                              <button
                                onClick={() => handleUpdateAppointmentStatus(apt.id, 'confirmed')}
                                className="p-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 transition-colors cursor-pointer"
                                title="Reactivate Appointment"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteAppointment(apt.id)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950/60 hover:text-red-400 text-zinc-400 transition-colors cursor-pointer"
                              title="Delete From SQLite"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MESSAGES INBOX */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {['all', 'unread', 'replied'].map((st) => (
                <button
                  key={st}
                  onClick={() => setMessageFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    messageFilter === st
                      ? 'bg-[#282834] text-[#d4af37] border border-[#d4af37]/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <span className="text-xs text-zinc-500">
              Showing {filteredMessages.length} inquiries
            </span>
          </div>

          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="rounded-2xl bg-[#131317] border border-[#25252e] p-12 text-center text-zinc-500 text-xs">
                No messages found.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-2xl border p-6 transition-all space-y-4 ${
                    msg.status === 'unread'
                      ? 'bg-[#181820] border-[#d4af37]/40 shadow-lg'
                      : 'bg-[#131317] border-[#25252e]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24242e] pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white text-base">
                          {msg.name}
                        </h3>
                        {msg.status === 'unread' ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-[10px] font-bold uppercase tracking-wider">
                            New / Unread
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-medium uppercase tracking-wider">
                            {msg.status}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                        <span>{msg.email}</span>
                        {msg.phone && (
                          <>
                            <span>·</span>
                            <span>{msg.phone}</span>
                          </>
                        )}
                        <span>·</span>
                        <span className="text-zinc-500">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="px-3 py-1.5 rounded-lg bg-[#22222c] hover:bg-[#d4af37] text-zinc-200 hover:text-[#0c0c0e] text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply Email</span>
                      </a>

                      {msg.status === 'unread' ? (
                        <button
                          onClick={() => handleUpdateMessageStatus(msg.id, 'replied')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Mark Replied
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateMessageStatus(msg.id, 'unread')}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                        >
                          Mark Unread
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:text-red-400 text-zinc-400 transition-colors cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-1">
                      Subject: {msg.subject}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ADD WALK-IN FORM */}
      {activeTab === 'walkin' && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-[#131317] border border-[#2b2b34] p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="border-b border-[#252530] pb-4">
            <h2 className="font-cinzel text-xl font-bold text-white">
              SCHEDULE WALK-IN / PHONE APPOINTMENT
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Directly insert an appointment into the database on behalf of a guest.
            </p>
          </div>

          <form onSubmit={handleCreateWalkin} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Guest Name *
                </label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="e.g. Sir Arthur"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Guest Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Service Ritual *
                </label>
                <input
                  type="text"
                  required
                  value={walkinService}
                  onChange={(e) => setWalkinService(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Service Price ($) *
                </label>
                <input
                  type="number"
                  required
                  value={walkinPrice}
                  onChange={(e) => setWalkinPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Barber *
                </label>
                <input
                  type="text"
                  required
                  value={walkinBarber}
                  onChange={(e) => setWalkinBarber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={walkinDate}
                  onChange={(e) => setWalkinDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Time Slot *
                </label>
                <input
                  type="text"
                  required
                  value={walkinTime}
                  onChange={(e) => setWalkinTime(e.target.value)}
                  placeholder="e.g. 02:00 PM"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Staff Notes (Optional)
              </label>
              <input
                type="text"
                value={walkinNotes}
                onChange={(e) => setWalkinNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2b2b36] focus:border-[#d4af37] focus:outline-none text-white text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingWalkin}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89025] hover:from-[#e2c158] hover:to-[#c69d2f] text-[#0d0d10] font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmittingWalkin ? 'Saving...' : 'Confirm Walk-In Booking'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
