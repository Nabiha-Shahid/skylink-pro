"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Calendar, User, Mail, ChevronRight, X, Edit2, Trash2, Award, Zap, Star, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";

interface Booking {
  id: string | number;
  status: string;
  total_price: number;
  passenger_name?: string;
  passenger_email?: string;
  flight: {
    flight_number: string;
    origin: string;
    destination: string;
    departure_time: string;
    airline?: string;
  };
}

interface DashboardData {
  user: {
    full_name: string;
    email: string;
    loyalty_points: number;
  };
  upcoming_flights: Booking[];
  past_flights: Booking[];
  total_trips: number;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/$/, "");

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showManifestToast, setShowManifestToast] = useState(false);

  const triggerManifest = () => {
    setShowManifestToast(true);
    setTimeout(() => setShowManifestToast(false), 4000);
  };

  const handleUpdate = async () => {
    if (!editingBooking) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/bookings/${editingBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passenger_name: editName, passenger_email: editEmail }),
      });
      if (res.ok) {
        const updatedBooking = await res.json();
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            upcoming_flights: prev.upcoming_flights.map(b => b.id === updatedBooking.id ? {...b, passenger_name: updatedBooking.passenger_name, passenger_email: updatedBooking.passenger_email} : b)
          }
        });
        setEditingBooking(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBooking) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/bookings/${deletingBooking.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setData((prev) => {
          if (!prev) return prev;
          return {
             ...prev,
             upcoming_flights: prev.upcoming_flights.filter(b => b.id !== deletingBooking.id),
             total_trips: prev.total_trips - 1
          }
        });
        setDeletingBooking(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
       setUpdating(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    const fetchDashboardData = async () => {
      if (!user) return;
      
      setFetchError(null);
      const url = `${API_BASE}/users/me/dashboard?firebase_uid=${user.uid}`;
      
      try {
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        
        const json = await res.json();
        setData(json);
        setFetching(false);
      } catch (err) {
        const error = err as Error;
        console.error("Dashboard synchronization failure!");
        console.error("Attempted URL:", url);
        console.error("Error details:", error);
        
        setFetchError(error.message || "Failed to synchronize with SkyLink servers.");
        setFetching(false);
      }
    };

    fetchDashboardData();
  }, [user, loading, router]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest animate-pulse">Synchronizing Data...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <X size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Sync Connection Lost</h2>
          <p className="text-slate-500 italic max-w-sm mx-auto">{fetchError}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!data) return null;

  const pointsToNextLevel = 5000 - (data.user.loyalty_points % 5000);
  const progress = ((data.user.loyalty_points % 5000) / 5000) * 100;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <span className="text-blue-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] mb-3 block">SkyLink Member // {user?.email}</span>
          <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tighter uppercase italic">Voyage Control</h1>
          <p className="text-slate-400 text-base md:text-lg font-medium italic">Welcome back, {user?.displayName || "SkyLink Voyager"}. Your next destination awaits.</p>
        </div>
        <div className="flex gap-3">
           <Link href="/">
              <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Book New Flight</button>
           </Link>
           <Link href="/skymiles">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">Upgrade Tier</button>
           </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
        {/* Loyalty Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(37,99,235,0.15)" }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 glass border border-white/5 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden group transition-all"
        >
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <Award className="text-amber-400" size={20} />
                   <p className="text-amber-400 font-black uppercase tracking-[0.4em] text-[10px]">Tier Status // Silver Elite</p>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">{data.user.loyalty_points.toLocaleString()} <span className="text-slate-600 text-2xl font-bold italic">Pts</span></h2>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">To Golden Tier</p>
                <p className="text-white font-black tracking-tight text-xl">{pointsToNextLevel.toLocaleString()} miles</p>
              </div>
            </div>
            
            <div className="w-full h-5 bg-slate-900/50 rounded-full mb-8 border border-white/5 p-1 overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] relative"
              >
                 <motion.div 
                   animate={{ opacity: [0.3, 0.7, 0.3] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 bg-white" 
                 />
              </motion.div>
            </div>
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <Star className="text-blue-400" size={14} />
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Lounge Access Activated</p>
               </div>
               <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all cursor-pointer">View Tier Rewards <ChevronRight size={14}/></p>
            </div>
          </div>
          <Zap className="absolute -right-20 -bottom-20 opacity-[0.02] text-white w-80 h-80 rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none" />
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
           transition={{ duration: 0.4, delay: 0.1 }}
           className="glass border border-white/5 p-12 rounded-[3.5rem] flex flex-col justify-between overflow-hidden relative group"
        >
           <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-black mb-2 uppercase tracking-[0.4em]">Lifetime Journeys</p>
              <p className="text-6xl md:text-8xl font-black mb-8 tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent italic">{data.total_trips}</p>
           </div>
           <button 
             onClick={triggerManifest}
             className="w-full py-5 bg-white text-slate-950 hover:bg-blue-400 rounded-2xl transition-all font-black uppercase tracking-widest text-xs relative z-10 shadow-2xl active:scale-95"
           >
             Generate Manifest
           </button>
           <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 blur-[80px] rounded-full group-hover:bg-blue-600/10 transition-all" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Upcoming Flights */}
        <div>
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-black uppercase tracking-widest flex items-center gap-4 text-white">
               <div className="w-2.5 h-10 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
               Active Missions
            </h3>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] italic">{data.upcoming_flights.length} Pending</span>
          </div>
          
          {data.upcoming_flights.length > 0 ? (
            <div className="space-y-8">
              <AnimatePresence mode="popLayout">
                {data.upcoming_flights.map((booking: Booking, idx: number) => (
                  <motion.div 
                    key={booking.id} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5, borderColor: "rgba(59,130,246,0.3)", boxShadow: "0 15px 30px rgba(0,0,0,0.3)" }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 transition-all group relative overflow-hidden"
                  >
                     <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                              <Star size={16} />
                           </div>
                           <span className="text-blue-400 font-mono text-xs font-black tracking-[0.4em] uppercase">{booking.flight.flight_number}</span>
                        </div>
                        <span className={`text-[10px] px-6 py-2 rounded-full font-black uppercase tracking-widest border ${booking.status === "confirmed" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}>
                          {booking.status}
                        </span>
                     </div>
                     <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-8 sm:gap-0">
                        <div className="text-center sm:text-left w-full sm:w-auto">
                          <p className="text-4xl md:text-5xl font-black tracking-tighter group-hover:text-blue-400 transition-colors uppercase leading-none">{booking.flight.origin}</p>
                          <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                             <Calendar size={12} className="text-slate-600" />
                             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Gate Terminal A</p>
                          </div>
                        </div>
                        <div className="w-full sm:flex-grow flex flex-col items-center px-4 opacity-20">
                          <Plane size={24} className="text-white rotate-180 sm:rotate-90 mb-2" />
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                        </div>
                        <div className="text-center sm:text-right w-full sm:w-auto">
                          <p className="text-4xl md:text-5xl font-black tracking-tighter group-hover:text-blue-400 transition-colors uppercase leading-none">{booking.flight.destination}</p>
                          <div className="flex items-center justify-center sm:justify-end gap-2 mt-3">
                             <MapPin size={12} className="text-slate-600" />
                             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">SkyLink Hub</p>
                          </div>
                        </div>
                     </div>
                     <div className="flex gap-4">
                         {/* FIX 1: aria-label added to icon-only buttons */}
                         <button
                           aria-label={`Modify booking for flight ${booking.flight.flight_number}`}
                           onClick={() => { setEditingBooking(booking); setEditName(booking.passenger_name || ""); setEditEmail(booking.passenger_email || ""); }}
                           className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                         >
                           <Edit2 size={12}/> Modify Intel
                         </button>
                         <button
                           aria-label={`Cancel booking for flight ${booking.flight.flight_number}`}
                           onClick={() => setDeletingBooking(booking)}
                           className="flex-1 py-5 bg-red-600/5 hover:bg-red-600/10 text-red-500/60 hover:text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-red-500/0 hover:border-red-500/20"
                         >
                           <Trash2 size={12}/> Abort Voyage
                         </button>
                     </div>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/0 group-hover:bg-blue-500/5 blur-[60px] rounded-full transition-all" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="p-20 glass border border-dashed border-white/10 rounded-[3.5rem] text-center flex flex-col items-center group overflow-hidden relative"
            >
              <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-700 mb-8 border border-white/5 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-all duration-500">
                 <Plane size={48} />
              </div>
              <p className="text-slate-400 mb-10 text-lg font-medium italic">Your mission log is currently empty.</p>
              <button 
                onClick={() => router.push("/flights")}
                className="px-12 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-[0_0_40px_rgba(37,99,235,0.3)]"
              >
                Initiate Route Scan
              </button>
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-700 pointer-events-none" />
            </motion.div>
          )}
        </div>

        {/* History / Recent Bookings */}
        <div>
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-black uppercase tracking-widest flex items-center gap-4 text-white">
               <div className="w-2.5 h-10 bg-slate-700 rounded-full" />
               Archive
            </h3>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] italic">Lifetime Records</span>
          </div>

          <div className="glass rounded-[3rem] border border-white/5 overflow-hidden">
             <div className="divide-y divide-white/[0.03]">
                {data.past_flights.length > 0 ? (
                  data.past_flights.map((booking: Booking, idx: number) => (
                    <motion.div 
                      key={booking.id} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                      className="flex justify-between items-center p-10 transition-colors group relative cursor-pointer"
                    >
                       <div className="relative z-10">
                          <p className="font-black text-xl tracking-tighter group-hover:text-blue-400 transition-colors uppercase italic">{booking.flight.origin} <span className="text-slate-700 font-bold mx-2 not-italic">→</span> {booking.flight.destination}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <ShieldCheck size={12} className="text-slate-600" />
                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Mission Completed // {new Date(booking.flight.departure_time).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="text-right relative z-10">
                          <p className="text-2xl font-black text-slate-300">$ {booking.total_price.toLocaleString()}</p>
                          <button className="text-[10px] text-blue-500 font-black uppercase mt-2 tracking-widest hover:text-white transition-all underline underline-offset-4">Get Manifest</button>
                       </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-20 text-center text-slate-600 font-medium italic">
                    Historical logs will appear once voyages complete.
                  </div>
                )}
             </div>
          </div>

          {/* Quick Support Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="mt-10 p-10 glass rounded-[2.5rem] border border-white/5 flex items-center justify-between"
          >
             <div>
                <h4 className="text-white font-black uppercase tracking-tighter mb-1">VIP Concierge</h4>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Direct Access Secured</p>
             </div>
             {/* FIX 2: aria-label added to icon-only Mail button */}
             <button
               aria-label="Contact VIP Concierge via email"
               className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
             >
                <Mail size={18} />
             </button>
          </motion.div>
        </div>
      </div>

      {/* Edit Passenger Modal */}
      <AnimatePresence>
        {editingBooking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl px-6"
            style={{ WebkitBackdropFilter: "blur(24px)" /* FIX 3: Safari support */ }}
          >
            <motion.div 
               initial={{ scale: 0.9, y: 30 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 30 }}
               className="glass max-w-lg w-full p-12 rounded-[3.5rem] border border-blue-500/20 shadow-3xl text-center relative"
            >
              <button 
                aria-label="Close edit modal"
                onClick={() => setEditingBooking(null)}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-8">
                 <User size={40} />
              </div>
              <h3 className="text-4xl font-black mb-3 tracking-tighter">Modify Agent Intel</h3>
              <p className="text-slate-500 text-sm mb-12 font-medium italic">Adjust coordinates for mission {editingBooking.flight.flight_number}</p>
              
              {/* FIX 4: label htmlFor + input id association for accessibility */}
              <div className="space-y-8 mb-12 text-left">
                <div>
                  <label htmlFor="edit-passenger-name" className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3 ml-1">
                    Full Agent Name
                  </label>
                  <input
                    id="edit-passenger-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-blue-500/50 transition-all text-white font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="edit-passenger-email" className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3 ml-1">
                    Contact Backbone (Email)
                  </label>
                  <input
                    id="edit-passenger-email"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-blue-500/50 transition-all text-white font-semibold"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button onClick={() => setEditingBooking(null)} className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Discard</button>
                <button onClick={handleUpdate} disabled={updating} className="flex-[2] py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl disabled:opacity-50">{updating ? "Synchronizing..." : "Secure Update"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {deletingBooking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl px-6"
            style={{ WebkitBackdropFilter: "blur(24px)" /* FIX 3: Safari support */ }}
          >
            <motion.div 
               initial={{ scale: 0.9, y: 30 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 30 }}
               className="glass max-w-md w-full p-12 rounded-[3.5rem] border border-red-500/20 shadow-3xl text-center"
            >
              <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                 <Trash2 size={40} />
              </div>
              <h3 className="text-4xl font-black mb-4 tracking-tighter text-red-500 uppercase">Abort Voyage?</h3>
              <p className="text-slate-500 text-sm mb-12 leading-relaxed italic">Are you sure you want to terminate the flight to <span className="font-bold text-white uppercase">{deletingBooking.flight.destination}</span>? All mileage points accrued for this mission will be nullified.</p>
              
              <div className="flex flex-col gap-4">
                <button onClick={handleDelete} disabled={updating} className="w-full py-6 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl disabled:opacity-50">{updating ? "Aborting..." : "Confirm Termination"}</button>
                <button onClick={() => setDeletingBooking(null)} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Keep Session Active</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manifest Success Toast */}
      <AnimatePresence>
        {showManifestToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-white text-slate-950 px-8 py-5 rounded-2xl shadow-3xl border border-white/20"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-sm font-black uppercase tracking-widest italic">Security Protocol</p>
               <p className="text-xs font-bold text-slate-600">Initiating secure manifest download...</p>
            </div>
            <button
              aria-label="Dismiss notification"
              onClick={() => setShowManifestToast(false)}
              className="ml-4 p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
            >
               <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
