"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Radar, Activity, Radio, Satellite } from "lucide-react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

// Dynamic import with SSR disabled — Three.js/WebGL cannot render on the server
const GlobeClient = dynamic(() => import("./GlobeClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Radar className="animate-spin mb-4 text-blue-500" size={48} />
      <p className="text-xs font-black uppercase tracking-[0.4em] text-blue-400">
        Initializing Quantum Fleet...
      </p>
    </div>
  ),
});

interface TelemetryData {
  flightId: string;
  altitude: number;
  latitude: string;
  longitude: string;
  yieldPrice: number;
  progress: string;
}

export default function StatusPage() {
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const telemetryUrl = process.env.NEXT_PUBLIC_TELEMETRY_URL || "http://localhost:4000";
    const socket = io(telemetryUrl);

    socket.on("connect", () => {
      console.log("Joined SkyLink Fleet Network");
    });

    socket.on("flightTelemetry", (data: TelemetryData[]) => {
      if (Array.isArray(data)) {
        setTelemetry(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Cycle through the fleet for the stat card display
  useEffect(() => {
    if (telemetry.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % telemetry.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [telemetry.length]);

  const activeFlight = telemetry[currentIndex];

  return (
    <>
      <div className="relative w-full h-screen -mt-24 -mb-12 bg-black overflow-hidden">
        {/* ─── Overlay: Title & Stats ─── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-28 md:top-32 left-6 md:left-12 z-20 pointer-events-none"
        >
          {/* Title Card */}
          <div className="glass px-6 py-4 md:px-8 md:py-6 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(37,99,235,0.12)] backdrop-blur-xl">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white flex items-center gap-4">
              Quantum Fleet
              <span className="text-blue-500">
                <Activity size={32} className="animate-pulse" />
              </span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-medium italic mt-2 tracking-widest uppercase">
              Live Fleet Stream &nbsp;// &nbsp;{telemetry.length} Active Vessels
            </p>
          </div>

          {/* Telemetry Stat Cards (Dynamic Switcher) */}
          <div className="mt-6 flex flex-col md:flex-col sm:flex-row gap-3 w-full md:w-auto md:min-w-[280px]">
             {/* Stacking logic: vertical on mobile, horizontal on small tablets, vertical on desktop overlay */}
             <div className="flex flex-col gap-3 flex-1">
                <motion.div
                  key={activeFlight?.flightId || 'loading'}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass px-5 py-4 rounded-2xl border border-white/5 backdrop-blur-md flex items-center gap-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mb-1 truncate">Active Vessel: {activeFlight?.flightId || '---'}</span>
                    <div className="flex justify-between items-end">
                       <div>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Altitude</span>
                          <span className="text-xl md:text-2xl font-black text-white font-mono leading-none">
                            {activeFlight ? activeFlight.altitude.toLocaleString() : "---"}
                            <span className="text-[10px] text-slate-600 ml-1">FT</span>
                          </span>
                       </div>
                       <div className="text-right">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Yield Price</span>
                          <span className="text-xl md:text-2xl font-black text-green-400 font-mono leading-none">
                            ${activeFlight ? activeFlight.yieldPrice.toLocaleString() : "---"}
                          </span>
                       </div>
                    </div>
                  </div>
                </motion.div>

                <div className="flex flex-row md:flex-col gap-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-md flex-1 md:w-fit flex items-center gap-4"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                      <div className="flex flex-col min-w-[80px] md:min-w-[120px]">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Coords</span>
                        <span className="text-[10px] md:text-sm font-black text-white font-mono leading-tight mt-0.5">
                          {activeFlight ? `${activeFlight.latitude}` : "---"} <br className="hidden md:block" />
                          {activeFlight ? `${activeFlight.longitude}` : "---"}
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="glass px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-md flex-1 md:w-fit flex items-center gap-4 group"
                    >
                      <Satellite size={14} className={`text-blue-400 ${activeFlight ? 'animate-pulse' : ''}`} />
                      <div className="flex flex-col min-w-[80px] md:min-w-[120px]">
                        <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest truncate">Live Price</span>
                        <span className="text-md md:text-lg font-black text-emerald-400 font-mono transition-colors duration-300">
                          ${activeFlight ? activeFlight.yieldPrice.toLocaleString() : "---"}
                        </span>
                      </div>
                    </motion.div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* ─── Bottom-right Legend ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 right-6 md:right-12 z-20 pointer-events-none"
        >
          <div className="glass px-5 py-4 rounded-2xl border border-white/5 backdrop-blur-md flex flex-col gap-2">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Legend</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-blue-300 rounded-full" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Route</span>
            </div>
            <div className="flex items-center gap-3">
              <Radio size={12} className="text-blue-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Landing Beacon</span>
            </div>
          </div>
        </motion.div>

        {/* ─── 3D Globe Canvas ─── */}
        <div className="absolute inset-0 z-0">
          <GlobeClient telemetry={telemetry} />
        </div>

        {/* Subtle top gradient (below Navbar for seamless blend) */}
        <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
        {/* Bottom fade to black */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
      </div>
    </>
  );
}
