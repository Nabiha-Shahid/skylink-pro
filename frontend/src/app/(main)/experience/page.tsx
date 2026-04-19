"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Coffee, Utensils, Monitor, ChevronRight } from "lucide-react";

interface ExperienceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

const experiences: ExperienceItem[] = [
  {
    id: "suites",
    title: "First Class Suites",
    description: "Experience absolute privacy in our AI-tuned bio-metric nodes. Featuring lie-flat memory foam and personalized climate control.",
    image: "https://i.insider.com/64e8d8e7bc26b40019900220?width=700",
    icon: <Sparkles size={24} />
  },
  {
    id: "lounges",
    title: "Private Global Lounges",
    description: "Seamless transitions from city to sky. Access our ultra-exclusive lounges featuring spa treatments and private workspaces.",
    image: "https://media.admiddleeast.com/photos/67adc739da52ed6d59db86c5/16:9/w_2560%2Cc_limit/DSC_1889.jpg",
    icon: <Coffee size={24} />
  },
  {
    id: "dining",
    title: "Gourmet Dining",
    description: "Michelin-star menus curated by world-renowned chefs. Experience dynamic food and wine pairings at 35,000 feet.",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200",
    icon: <Utensils size={24} />
  },
  {
    id: "vr",
    title: "Immersive In-Flight VR",
    description: "Transcend the cabin with our 8K spatial reality headsets. Transform your flight into a private cinema or a virtual relaxation node.",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1200",
    icon: <Monitor size={24} />
  }
];

import dynamic from "next/dynamic";

import { io } from "socket.io-client";

const SuiteViewerClient = dynamic(() => import("./SuiteViewerClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  ),
});

export default function ExperiencePage() {
  const [seatTaken, setSeatTaken] = React.useState(false);

  React.useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("seatUpdate", (data) => {
      if (data.status === "taken") {
        setSeatTaken(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleBookSeat = () => {
    // Send standard ping to backend
    const socket = io("http://localhost:4000");
    socket.emit("bookSeat");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 relative z-10">
      {/* Hero Section with 3D Suite Viewer */}
      <div className="mb-16 md:mb-24 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full relative z-10 pointer-events-none"
        >
          <span className="text-blue-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] mb-4 block">SkyLink Standards // Premium</span>
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">The SkyLink <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Experience.</span></h1>
          <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto italic font-medium leading-relaxed">
            Redefining the upper atmosphere. Discover a world where every detail is curated for the next generation of global voyagers.
          </p>
        </motion.div>

         {/* 3D Canvas Box */}
         <motion.div 
           initial={{ scale: 0.95, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.2, duration: 0.8 }}
           className="w-full max-w-5xl relative mt-12"
         >
           <div className="w-full h-[500px] rounded-[3rem] overflow-hidden glass border border-white/10 shadow-2xl relative">
              <SuiteViewerClient />
              {/* Hint text over canvas */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none px-4 py-2 glass-pill rounded-full border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Interact to rotate suite preview</p>
              </div>
           </div>

           {/* Live Availability Booking Node */}
           <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.6 }}
             className="absolute -bottom-6 right-8 md:right-12 z-20"
           >
              {seatTaken ? (
                 <div className="bg-red-600/90 backdrop-blur-xl border border-red-400 font-black px-8 py-4 rounded-2xl text-white shadow-lg shadow-red-900/50 animate-pulse flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-400 animate-ping absolute -top-1 -right-1" />
                    UNAVAILABLE
                 </div>
              ) : (
                 <button 
                   onClick={handleBookSeat}
                   className="bg-emerald-500 hover:bg-emerald-400 backdrop-blur-xl border border-emerald-400 font-black px-8 py-4 rounded-2xl text-white shadow-xl shadow-emerald-900/50 transition-all flex items-center gap-4 group"
                 >
                    <span className="text-[10px] uppercase tracking-widest opacity-80 border-r border-white/20 pr-4">Live Yield</span>
                    $4,225 - RESERVE
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
                 </button>
              )}
           </motion.div>
         </motion.div>
       </div>

      {/* Experience Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {experiences.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
            whileHover={{ y: -10 }}
            className="group relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: `url(${exp.image})` }}
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-500" />

            {/* Content */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                  {exp.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase italic">{exp.title}</h2>
              </div>
              
              <p className="text-slate-200 text-sm md:text-base font-medium mb-8 max-w-sm leading-relaxed translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                {exp.description}
              </p>

              <div className="flex items-center gap-4">
                <button className="px-6 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all shadow-xl">
                  Explore More
                </button>
                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>

            {/* Subtle Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/0 group-hover:bg-blue-500/10 blur-[60px] rounded-full transition-all duration-700" />
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-24 md:mt-32 text-center p-12 md:p-20 glass rounded-[4rem] border border-white/5 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h3 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter uppercase italic text-white line-clamp-2 md:line-clamp-none">Ready to elevate your standards?</h3>
          <Link 
            href="/"
            className="inline-block px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-blue-900/40 group text-center"
          >
             Book Your Voyage Now <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
}
