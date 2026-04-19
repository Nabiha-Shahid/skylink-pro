"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, User, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract first name for the portal button
  const displayName = user?.displayName ? user.displayName.split(" ")[0] : "Portal";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Book", href: "/flights" },
    { name: "Experience", href: "/experience" },
    { name: "Careers", href: "/careers" },
    { name: "SkyMiles", href: "/skymiles" },
    { name: "Status", href: "/status" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500 px-8 py-4 rounded-3xl border border-white/5 ${scrolled ? 'glass shadow-2xl backdrop-blur-xl' : 'bg-transparent'}`}>
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
            <Plane size={20} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
            SkyLink
          </span>
        </Link>

        <div className="hidden md:flex gap-10 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-[10px] font-black uppercase tracking-[0.2em] group transition-colors"
            >
              <span className={pathname === link.href ? "text-blue-400" : "text-slate-400 group-hover:text-white"}>
                {link.name}
              </span>
              {pathname === link.href && (
                <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex gap-3 items-center">
              <Link
                href="/dashboard"
                className={`hidden sm:flex items-center gap-2 pl-2 pr-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-xs font-bold ${pathname === "/dashboard" ? "bg-white/5 border-blue-500/50" : ""
                  }`}
              >
                <div className="relative w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="User Profile"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  ) : (
                    <User size={14} className="text-slate-500" />
                  )}
                </div>
                {displayName}
              </Link>
              <button
                onClick={logout}
                className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Link href="/login" className="px-6 py-3 rounded-xl hover:bg-white/5 transition text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white">Log In</Link>
              <Link href="/signup" className="px-8 py-3 rounded-xl bg-white text-slate-950 hover:bg-blue-400 transition-all text-[10px] font-black uppercase tracking-widest shadow-xl">
                Sign Up
              </Link>
            </div>
          )}

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-3 text-slate-400 hover:text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="md:hidden absolute top-28 left-6 right-6 glass p-8 rounded-[2.5rem] border border-white/10 z-40 shadow-2xl backdrop-blur-3xl"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-black uppercase tracking-[0.2em] text-center ${pathname === link.href ? 'text-blue-400' : 'text-slate-400'}`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px bg-white/5 my-2" />
              
              {user ? (
                <div className="flex flex-col gap-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold"
                  >
                    <User size={18} /> {displayName}&apos;s Portal
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-6 py-4 rounded-2xl border border-white/10 text-center text-[10px] font-black uppercase tracking-widest text-white"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-6 py-4 rounded-2xl bg-white text-slate-950 text-center text-[10px] font-black uppercase tracking-widest shadow-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}