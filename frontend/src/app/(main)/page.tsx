"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FlightSearch from "@/components/FlightSearch";
import { Plane, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-50">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      {/* Decorative Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-widest mb-10"
        >
          <Zap size={14} />
          <span>New: Next-Gen Fare Intelligence</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl md:text-9xl font-black mb-10 leading-[0.9] tracking-tighter bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent"
        >
          SKY REIMAGINED. <br />
          <span className="text-blue-500 italic">NEXT GEN</span> BOOKING.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-slate-300 max-w-2xl mx-auto mb-16 font-medium leading-relaxed"
        >
          Experience the pinnacle of aviation technology. Real-time yield management meets ultimate luxury.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <FlightSearch />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {[
          { icon: <Zap size={32} />, title: "Yield Optimization", desc: "Our proprietary intelligence adjusts fares in real-time based on global demand, market volatility, and historical trends." },
          { icon: <ShieldCheck size={32} />, title: "Secure FinTech", desc: "Enterprise-grade Stripe integration for global payments and instant multi-currency settlement." },
          { icon: <Plane size={32} />, title: "Global Network", desc: "Access to over 500 premium destinations with 24/7 concierge support for every passenger." }
        ].map((feat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10, borderColor: "rgba(59,130,246,0.3)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
            className="flex flex-col items-center text-center p-10 rounded-[2.5rem] glass border border-white/5 transition-all duration-500 group"
          >
            <div className="w-20 h-20 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              {feat.icon}
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{feat.title}</h3>
            <p className="text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Trending Destinations */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-5xl font-black tracking-tighter mb-4">Trending Missions</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Top curated routes for the elite traveler</p>
          </div>
          <button className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">Explore All <ChevronRight size={16} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { city: 'Tokyo', price: 899, img: 'bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.8)),url("https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80")]' },
            { city: 'Paris', price: 649, img: 'bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.8)),url("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80")]' },
            { city: 'New York', price: 449, img: 'bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.8)),url("https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80")]' }
          ].map((dest, i) => (
            <Tilt
              key={i}
              perspective={1000}
              glareEnable={true}
              glareMaxOpacity={0.45}
              glarePosition="all"
              scale={1.02}
              className={`h-[450px] rounded-[3rem] ${dest.img} bg-cover bg-center p-10 flex flex-col justify-end transition-all duration-300 cursor-pointer border border-white/10 overflow-hidden group shadow-2xl`}
            >
              <h3 className="text-4xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tighter">{dest.city}</h3>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-mono text-xs uppercase tracking-[0.2em]">Starting from</span>
                <span className="text-3xl font-black text-blue-400">${dest.price}</span>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* The SkyLink Experience */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <h2 className="text-5xl font-black mb-20 text-center tracking-tighter">The Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { tag: "Economy Plus", desc: "Extra legroom, priority boarding, and complimentary premium seating for the smart traveler.", color: "text-blue-100" },
            { tag: "Business Premium", desc: "Lie-flat seats, chef-curated dining, and exclusive lounge access globally.", color: "text-blue-400", premium: true },
            { tag: "First Class Suites", desc: "Ultimate privacy with your own enclosed suite, caviar service, and dedicated flight attendant.", color: "text-purple-200" }
          ].map((exp, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -15, scale: 1.02 }}
              className={`p-12 rounded-[3.5rem] transition-all flex flex-col items-center text-center shadow-2xl ${exp.premium ? 'bg-gradient-to-b from-blue-900/40 to-slate-900 border border-blue-500/20 transform md:-translate-y-8' : 'glass border border-white/5'}`}
            >
              <h3 className={`text-3xl font-black mb-6 uppercase tracking-tight ${exp.color}`}>{exp.tag}</h3>
              <p className="text-slate-400 leading-relaxed font-medium italic">{exp.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SkyMiles Rewards */}
      <section className="py-32 px-6 mb-32 max-w-5xl mx-auto relative z-10">
        <motion.div
          whileHover={{ boxShadow: "0 0 50px rgba(234,179,8,0.1)" }}
          className="glass rounded-[4rem] p-16 text-center border border-yellow-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />
          <h2 className="text-6xl font-black mb-6 bg-gradient-to-r from-yellow-200 to-yellow-600 bg-clip-text text-transparent uppercase tracking-tighter">
            SkyMiles Loyalty
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto font-medium">
            Earn miles on every booking. Unlock lounge access, free upgrades, and priority service.
          </p>

          <div className="bg-slate-900/50 rounded-full h-5 w-full max-w-lg mx-auto mb-6 border border-white/5 overflow-hidden flex p-1">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "15%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]"
            />
          </div>
          <p className="text-xs text-slate-500 font-black mb-12 uppercase tracking-[0.4em]">Next Tier: Silver (25,000 miles to go)</p>

          <Link href="/signup">
            <button className="px-12 py-5 bg-white text-slate-950 hover:bg-yellow-400 transition-all rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl">
              Join For Free
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Trust Badge / Footer Note */}
      <div className="pb-32 flex justify-center opacity-30 hover:opacity-100 transition-opacity duration-700">
        <p className="font-black text-[10px] uppercase tracking-[0.5em] text-slate-500">SKYLINK ARCHITECTURE // NABIHA SHAHID DESIGN</p>
      </div>
    </main>
  );
}

