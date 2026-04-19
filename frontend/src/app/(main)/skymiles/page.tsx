"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Award, Star, History, TrendingUp, Zap, ChevronRight, CheckCircle2, Shield, Gem, Wind } from "lucide-react";

interface Milestone {
  id: string;
  activity: string;
  date: string;
  points: string;
  type: 'flight' | 'bonus' | 'partner';
}

const mockActivity: Milestone[] = [
  { id: '1', activity: 'JFK to LHR (Economy Core)', date: 'Apr 10, 2026', points: '+1,240', type: 'flight' },
  { id: '2', activity: 'Quarterly Status Bonus', date: 'Mar 15, 2026', points: '+500', type: 'bonus' },
  { id: '3', activity: 'SkyLink Partner: Luxe Hotels', date: 'Feb 28, 2026', points: '+850', type: 'partner' },
  { id: '4', activity: 'LHR to CDG (Premium Member)', date: 'Feb 12, 2026', points: '+620', type: 'flight' },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function SkyMilesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [points, setPoints] = useState<number>(0);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/skymiles");
    }

    if (user) {
      fetch(`${API_BASE}/users/me/dashboard?firebase_uid=${user.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) setPoints(data.user.loyalty_points);
          setFetching(false);
        })
        .catch(err => {
          console.error("SkyMiles points fetch error", err);
          setFetching(false);
        });
    }
  }, [user, loading, router]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest animate-pulse">Scanning Bio-Metrics...</p>
      </div>
    );
  }

  const progress = ((points % 5000) / 5000) * 100;
  const pointsToNext = 5000 - (points % 5000);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 md:mb-16 text-center"
      >
        <span className="text-blue-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] mb-4 block">Loyalty Protocol</span>
        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter">Your Journey Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 italic">Elite.</span></h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto italic font-medium">Elevating every mile into an exclusive experience. Welcome to the upper atmosphere of travel.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Tier Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-12 xl:col-span-8 glass p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-40 -mt-40 group-hover:bg-blue-600/10 transition-all duration-1000" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500/10 border border-amber-500/20 rounded-2xl md:rounded-3xl flex items-center justify-center mb-8 md:mb-10 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
                <Shield className="text-amber-400" size={32} />
              </div>
              <h2 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-3 ml-1">Current Membership</h2>
              <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Silver Elite</h3>

              <div className="flex gap-4">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Status</span>
                </div>
                <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center gap-2">
                  <Zap size={12} className="text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Priority Pass</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/50 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 backdrop-blur-md">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Balance</h4>
                  <p className="text-4xl md:text-5xl font-black tracking-tighter">{points.toLocaleString()} <span className="text-slate-600 text-xl md:text-2xl font-bold italic">Pts</span></p>
                </div>
                <TrendingUp className="text-cyan-400 mb-2" size={20} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>To Golden Level</span>
                  <span className="text-white">{pointsToNext.toLocaleString()} miles</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-300 rounded-full relative"
                  >
                    <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-white" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Quick List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-12 xl:col-span-4 glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/5"
        >
          <div className="flex items-center gap-3 mb-10">
            <Gem className="text-blue-400" size={24} />
            <h3 className="text-xl font-black uppercase tracking-widest">Rewards</h3>
          </div>
          <div className="space-y-6">
            {[
              { icon: <Wind size={16} />, title: "Lounge Access", sub: "Elite Lounges Worldwide" },
              { icon: <Shield size={16} />, title: "Priority Lane", sub: "Skip Security Lines" },
              { icon: <Award size={16} />, title: "Bonus Yield", sub: "25% More Points per Trip" },
              { icon: <TrendingUp size={16} />, title: "Free Upgrade", sub: "Waitlist Priority Status" }
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-5 group cursor-pointer">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {benefit.icon}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white">{benefit.title}</p>
                  <p className="text-[10px] text-slate-500 font-bold tracking-tight">{benefit.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-12 glass rounded-[2rem] md:rounded-[3.5rem] border border-white/5 overflow-hidden"
        >
          <div className="px-6 md:px-12 py-8 md:py-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <History className="text-slate-400" size={20} />
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest">Recent Activity</h3>
            </div>
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-white transition-colors flex items-center gap-2">Full Archive <ChevronRight size={14} /></button>
          </div>

          <div className="divide-y divide-white/[0.03]">
            {mockActivity.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                className="px-6 md:px-12 py-6 md:py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group transition-colors"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/5 ${item.type === 'flight' ? 'bg-blue-600/10 text-blue-400' : 'bg-cyan-600/10 text-cyan-400'}`}>
                    {item.type === 'flight' ? <Award size={18} /> : <Star size={18} />}
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors italic leading-tight">{item.activity}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.date}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right pl-14 sm:pl-0">
                  <p className="text-xl font-black text-blue-400">{item.points}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">Verified</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] mb-8">SkyLink Rewards // Corporate Program Integration</p>
      </div>
    </div>
  );
}
