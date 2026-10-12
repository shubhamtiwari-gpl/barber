import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { BarbersPage } from './pages/BarbersPage';
import { BookingPage } from './pages/BookingPage';
import { AdminPage } from './pages/AdminPage';
import { ServiceItem, BarberProfile, CustomerReview, Appointment } from './types';
import { SERVICES as DEFAULT_SERVICES, BARBERS as DEFAULT_BARBERS, REVIEWS as DEFAULT_REVIEWS } from './data/defaultData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'services', 'barbers', 'booking', 'admin'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [barbers, setBarbers] = useState<BarberProfile[]>(DEFAULT_BARBERS);
  const [reviews, setReviews] = useState<CustomerReview[]>(DEFAULT_REVIEWS);

  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string>('gentlemans-cut');
  const [selectedBarberForBooking, setSelectedBarberForBooking] = useState<string>('marcus-vance');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('cb_admin_token'));
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Hash change listener for browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'services', 'barbers', 'booking', 'admin'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when currentTab changes
  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
  };

  // Toast dispatcher
  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch live catalog data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, barbersRes, reviewsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/barbers'),
          fetch('/api/reviews'),
        ]);

        if (servicesRes.ok) {
          const s = await servicesRes.json();
          if (Array.isArray(s) && s.length > 0) setServices(s);
        }

        if (barbersRes.ok) {
          const b = await barbersRes.json();
          if (Array.isArray(b) && b.length > 0) setBarbers(b);
        }

        if (reviewsRes.ok) {
          const r = await reviewsRes.json();
          if (Array.isArray(r) && r.length > 0) setReviews(r);
        }
      } catch (err) {
        console.warn('Using seeded data for catalogue:', err);
      }
    };

    fetchData();
  }, []);

  const handleSelectServiceForBooking = (serviceId: string) => {
    setSelectedServiceForBooking(serviceId);
  };

  const handleSelectBarberForBooking = (barberId: string) => {
    setSelectedBarberForBooking(barberId);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f4f4f6] flex flex-col font-sans-body">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            services={services}
            barbers={barbers}
            reviews={reviews}
            onNavigate={handleNavigate}
            onSelectServiceForBooking={handleSelectServiceForBooking}
            onSelectBarberForBooking={handleSelectBarberForBooking}
          />
        )}

        {currentTab === 'services' && (
          <ServicesPage
            services={services}
            onNavigate={handleNavigate}
            onSelectServiceForBooking={handleSelectServiceForBooking}
          />
        )}

        {currentTab === 'barbers' && (
          <BarbersPage
            barbers={barbers}
            onNavigate={handleNavigate}
            onSelectBarberForBooking={handleSelectBarberForBooking}
          />
        )}

        {currentTab === 'booking' && (
          <BookingPage
            services={services}
            barbers={barbers}
            initialServiceId={selectedServiceForBooking}
            initialBarberId={selectedBarberForBooking}
            showToast={showToast}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPage
            onBackToClientSite={() => handleNavigate('home')}
            showToast={showToast}
            onAdminAuthChange={setIsAdminLoggedIn}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
