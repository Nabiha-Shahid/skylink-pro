"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setShowToast(true);
      setEmail("");
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10 px-6 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        {/* Brand Section */}
        <div className="md:col-span-4 space-y-6">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent tracking-tight">
            SkyLink
          </Link>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm italic">
            Elevating the standard of air travel with algorithmic yield management and seamless premium experiences. Join the next generation of aviation.
          </p>
          <div className="pt-4 flex gap-4">
            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group shadow-lg shadow-black/20">
               <span className="sr-only">Twitter</span>
               <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group shadow-lg shadow-black/20">
               <span className="sr-only">LinkedIn</span>
               <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>

        {/* Links Sections */}
        <div className="md:col-span-2">
          <h4 className="text-white font-black mb-8 text-sm uppercase tracking-[0.2em]">Company</h4>
          <ul className="space-y-4 text-xs font-semibold text-slate-500">
            <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
            <li><Link href="/press" className="hover:text-blue-400 transition-colors">Press & Media</Link></li>
            <li><Link href="/sustainability" className="hover:text-blue-400 transition-colors">Sustainability</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-white font-black mb-8 text-sm uppercase tracking-[0.2em]">Support</h4>
          <ul className="space-y-4 text-xs font-semibold text-slate-500">
            <li><Link href="/help" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
            <li><Link href="/status" className="hover:text-blue-400 transition-colors">Flight Status</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Subscription Section */}
        <div className="md:col-span-4 space-y-6">
          <h4 className="text-white font-black mb-2 text-sm uppercase tracking-[0.2em]">Stay Informed</h4>
          <p className="text-slate-400 text-sm">Subscribe to receive real-time yield alerts and exclusive premium offers.</p>
          <form className="relative group" onSubmit={handleSubmit}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
            />
            <button 
              type="submit"
              aria-label="Subscribe"
              title="Subscribe"
              className="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white transition-all shadow-lg shadow-blue-900/20 group-hover:scale-105 active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black tracking-widest uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            GLOBAL NETWORK SECURE
          </div>
        </div>
      </div>
      
      {/* Bottom section */}
      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">© 2026 SkyLink Airways // Next-Gen Aviation</p>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Designed and Developed by Nabiha Shahid</p>
        </div>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-white text-slate-950 px-8 py-5 rounded-2xl shadow-3xl border border-white/20"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-500/20">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-sm font-black uppercase tracking-widest">Success!</p>
               <p className="text-xs font-bold text-slate-600">You&apos;ve subscribed successfully.</p>
            </div>
            <button 
              onClick={() => setShowToast(false)} 
              aria-label="Close notification"
              title="Close notification"
              className="ml-4 p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
            >
               <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}