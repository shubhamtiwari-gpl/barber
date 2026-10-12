export interface ServiceItem {
  id: string;
  name: string;
  category: 'hair' | 'beard' | 'royal' | 'treatments';
  price: number;
  durationMinutes: number;
  description: string;
  popular?: boolean;
}

export interface BarberProfile {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  specialty: string;
  bio: string;
  avatar: string;
  availability: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  title: string;
  text: string;
  rating: number;
  service: string;
  barber: string;
  date: string;
}

export interface Appointment {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  service_id: string;
  service_name: string;
  service_price: number;
  barber_id: string;
  barber_name: string;
  date: string;
  time: string;
  notes?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'replied' | 'archived';
  created_at: string;
}

export interface AdminStats {
  totalBookingsToday: number;
  totalBookings: number;
  pendingMessages: number;
  completedBookings: number;
  totalRevenue: number;
}

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  email?: string;
  preferred_service?: string;
  preferred_barber?: string;
  created_at: string;
  last_login_at?: string;
}
