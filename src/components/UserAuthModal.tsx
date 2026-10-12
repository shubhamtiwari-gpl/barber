import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Phone,
  Lock,
  User,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  Info,
} from 'lucide-react';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, token: string) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  showToast,
}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phone.trim() || !password.trim()) {
      setErrorMessage('कृपया मोबाइल नंबर और पासवर्ड दोनों दर्ज करें।');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          password: password.trim(),
          name: name.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }

      localStorage.setItem('cb_user_token', data.token);
      localStorage.setItem('cb_user_profile', JSON.stringify(data.user));

      if (data.isNewUser) {
        showToast(
          'success',
          'स्वागत है! / Welcome!',
          'आपका पासवर्ड सुरक्षित सेव हो गया है। अगली बार इसी से लॉगिन करें।'
        );
      } else {
        showToast(
          'success',
          'लॉगिन सफल / Logged in!',
          `नमस्ते, ${data.user.name || 'Patron'}! आपकी प्रोफ़ाइल लोड हो गई है।`
        );
      }

      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      console.error('Customer auth error:', err);
      setErrorMessage(err.message || 'लॉगिन में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      showToast('error', 'प्रमाणीकरण विफल / Auth Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickDemo = (demoPhone: string, demoPass: string, demoName: string) => {
    setPhone(demoPhone);
    setPassword(demoPass);
    setName(demoName);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#131317] border border-[#2e2e38] shadow-2xl p-6 sm:p-8 overflow-hidden text-left">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#191922] border border-[#d4af37]/50 flex items-center justify-center mx-auto text-[#d4af37] shadow-lg">
            <KeyRound className="w-6 h-6" />
          </div>

          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            PATRON ACCESS · ग्राहक लॉगिन
          </h2>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            मोबाइल नंबर और पासवर्ड से लॉगिन करें या पहली बार नया पासवर्ड सेट करें।
          </p>
        </div>

        {/* Informative Rule Notice */}
        <div className="mb-5 p-3 rounded-xl bg-[#1a1a24] border border-[#d4af37]/30 flex items-start gap-2.5 text-xs text-zinc-300">
          <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="text-[#d4af37] font-semibold block">पहली बार लॉगिन कर रहे हैं?</span>
            जो पासवर्ड आप अभी डालेंगे, वही सुरक्षित सेव हो जाएगा। अगली बार उसी पासवर्ड से प्रोफाइल खुलेगी।
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              मोबाइल नंबर / Mobile Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210 या +91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181820] border border-[#2c2c36] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600 font-medium"
              />
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              पासवर्ड / Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="अपना गुप्त पासवर्ड डालें"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181820] border border-[#2c2c36] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600 font-medium"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              पहला पासवर्ड हमेशा के लिए सेव रहेगा और हर बार मैच होगा।
            </p>
          </div>

          {/* Optional Name for First Time */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              आपका नाम / Your Name (नए यूज़र्स के लिए)
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma / Alexander"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181820] border border-[#2c2c36] focus:border-[#d4af37] focus:outline-none text-white text-xs placeholder:text-zinc-600"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89025] hover:from-[#e2c158] hover:to-[#c69d2f] text-[#0d0d10] font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#d4af37]/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>जांच हो रही है... / Verifying...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>लॉगिन करें / प्रवेश करें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Fill Triggers */}
        <div className="mt-6 pt-4 border-t border-[#23232c] text-center space-y-2">
          <span className="text-[11px] text-zinc-400 block">त्वरित परीक्षण / Quick Demo Fill:</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('9876543210', 'patron123', 'Vikram Malhotra')}
              className="px-2.5 py-1 rounded-lg bg-[#181820] border border-zinc-700 hover:border-[#d4af37] text-[11px] text-zinc-300 hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              Demo User 1 (9876543210)
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('+1 (555) 234-8901', 'sterling2026', 'Alexander Sterling')}
              className="px-2.5 py-1 rounded-lg bg-[#181820] border border-zinc-700 hover:border-[#d4af37] text-[11px] text-zinc-300 hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              Existing Client (Alexander)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
