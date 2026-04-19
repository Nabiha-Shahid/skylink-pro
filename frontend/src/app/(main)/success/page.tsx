"use client";
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Plane, Download, Share2, ArrowRight, User, Hash, Ticket } from 'lucide-react';
import Link from 'next/link';

interface HolographicTicketProps {
  bookingId: string;
  flightNum: string;
  origin: string;
  destination: string;
  seat: string;
  passenger: string;
}

function HolographicTicket({ bookingId, flightNum, origin, destination, seat, passenger }: HolographicTicketProps) {
  const [flipped, setFlipped] = React.useState(false);
  const [randomSpots, setRandomSpots] = React.useState<boolean[]>([]);

  React.useEffect(() => {
    // Generate random layout only on client to avoid hydration mismatch
    setRandomSpots(Array.from({ length: 25 }, () => Math.random() > 0.4));
  }, []);


  return (
    <motion.div 
      className="w-full h-full relative"
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onTap={() => setFlipped(!flipped)}
    >
      {/* Front Face */}
      <div className="absolute inset-0 backface-hidden glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl text-left bg-slate-900/80 backdrop-blur-xl">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 flex justify-between items-center bg-opacity-80">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 opacity-80">Boarding Pass // Front</p>
            <h2 className="text-2xl font-black text-white">SkyLink Premier</h2>
          </div>
          <Plane className="text-white/40" size={32} />
        </div>
        <div className="p-8 md:p-12">
          {/* Route Summary */}
          <div className="flex justify-between items-center mb-10 pb-10 border-b border-white/5">
             <div className="text-left">
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">Origin</p>
                <p className="text-5xl font-black text-white tracking-tighter">{origin}</p>
             </div>
             <div className="flex-1 flex flex-col items-center px-4">
                <div className="w-full h-px bg-dashed bg-white/10 relative">
                   <Plane className="absolute -top-3 left-1/2 -translate-x-1/2 text-blue-500 rotate-90" size={24} />
                </div>
             </div>
             <div className="text-right">
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">Destination</p>
                <p className="text-5xl font-black text-white tracking-tighter">{destination}</p>
             </div>
          </div>
          {/* Passenger details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-4">
             <div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><User size={12}/> Passenger</div>
                <p className="text-lg font-bold text-white leading-tight">{passenger}</p>
             </div>
             <div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><Hash size={12}/> Flight ID</div>
                <p className="text-lg font-bold text-blue-400">{flightNum}</p>
             </div>
             <div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><Ticket size={12}/> Seat</div>
                <p className="text-lg font-bold text-white">{seat}</p>
             </div>
             <div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><User size={12}/> Gate</div>
                <p className="text-lg font-bold text-white">B-24</p>
             </div>
          </div>
          <p className="text-[10px] text-center mt-8 text-blue-400 animate-pulse uppercase tracking-[0.2em] font-black cursor-pointer">Tap to flip &lt;-&gt;</p>
        </div>
      </div>

      {/* Back Face */}
      <div 
        className="absolute inset-0 backface-hidden glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl text-left bg-slate-900"
        style={{ transform: "rotateY(180deg)" }}
      >
        <div className="bg-slate-800 p-8 border-b border-white/5">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Manifest // Back</p>
        </div>
        <div className="p-8 md:p-12 flex flex-col items-center justify-center h-[350px]">
           <div className="w-48 h-48 bg-white p-4 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden group">
              {/* Fake QR Scanner line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-50 animate-bounce" style={{ animationDuration: "2s" }} />
                <div className="w-full h-full border-4 border-slate-900 grid grid-cols-5 grid-rows-5 gap-1">
                  {randomSpots.length > 0 ? (
                    randomSpots.map((isDark, i) => (
                      <div key={i} className={`rounded-sm ${isDark ? 'bg-slate-950' : 'bg-transparent'}`} />
                    ))
                  ) : (
                    // Placeholder during hydration
                    Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className="rounded-sm bg-transparent" />
                    ))
                  )}
                </div>
           </div>
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-8 text-center">Tracking: {bookingId}</p>
           <div className="h-10 w-full max-w-sm bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#1e293b_2px,#1e293b_4px)] opacity-30 mt-4 mx-auto" />
        </div>
      </div>
    </motion.div>
  );
}

interface FlightData {
  flight_number: string;
  origin: string;
  destination: string;
}

interface BookingResponse {
  booking_id: string;
  flight: FlightData;
}

function getCoordinates(city: string) {
  const coords: { [key: string]: string } = {
    'JFK': '40.7128° N, 74.0060° W',
    'LHR': '51.5074° N, 0.1278° W',
    'CDG': '48.8566° N, 2.3522° E',
    'DXB': '25.2048° N, 55.2708° E',
    'SFO': '37.7749° N, 122.4194° W',
    'LAX': '33.9416° N, 118.4085° W',
    'SIN': '1.3521° N, 103.8198° E'
  };
  return coords[city.toUpperCase()] || '0.0000° N, 0.0000° E';
}

function UnifiedPrintTicket({ bookingId, flightNum, origin, destination, seat, passenger }: HolographicTicketProps) {
  const [randomSpots, setRandomSpots] = React.useState<boolean[]>([]);
  const coordinates = getCoordinates(destination);
  const pnr = bookingId.split('-')[1] || 'SKL-PRMR';

  React.useEffect(() => {
    setRandomSpots(Array.from({ length: 25 }, () => Math.random() > 0.4));
  }, []);

  return (
    <div className="w-full max-w-[21cm] bg-slate-900 text-white rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl text-left font-sans mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-10 flex justify-between items-center">
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.3em] text-blue-100 opacity-80">Official Boarding Pass // Premier Class</p>
          <h2 className="text-4xl font-black text-white tracking-tight">SkyLink Premier</h2>
        </div>
        <Plane className="text-white/40" size={48} />
      </div>

      <div className="p-12 md:p-16">
        {/* Route Summary */}
        <div className="flex justify-between items-center mb-16 pb-16 border-b border-white/5">
           <div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Origin</p>
              <p className="text-7xl font-black text-white tracking-tighter">{origin}</p>
           </div>
           <div className="flex-1 flex flex-col items-center px-10">
              <div className="w-full h-px bg-white/10 relative">
                 <Plane className="absolute -top-4 left-1/2 -translate-x-1/2 text-blue-500 rotate-90" size={32} />
              </div>
           </div>
           <div className="text-right">
              <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Destination</p>
              <p className="text-7xl font-black text-white tracking-tighter">{destination}</p>
           </div>
        </div>

        {/* Global Travel Attributes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 mb-16">
           <div className="border-l-2 border-blue-500/30 pl-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><User size={12}/> Passenger</div>
              <p className="text-2xl font-bold text-white leading-tight">{passenger}</p>
           </div>
           <div className="border-l-2 border-blue-500/30 pl-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><Hash size={12}/> Flight ID</div>
              <p className="text-2xl font-bold text-blue-400">{flightNum}</p>
           </div>
           <div className="border-l-2 border-blue-500/30 pl-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><Ticket size={12}/> Seat Number</div>
              <p className="text-2xl font-bold text-white uppercase">{seat}</p>
           </div>
           <div className="border-l-2 border-blue-500/30 pl-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><Plane size={12}/> Coordinates</div>
              <p className="text-xl font-bold text-slate-400 font-mono tracking-tight">{coordinates}</p>
           </div>
        </div>

        {/* Security and PNR Manifest */}
        <div className="pt-12 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-10">
              <div className="w-32 h-32 bg-white p-2 rounded-lg grid grid-cols-5 grid-rows-5 gap-1 shadow-inner">
                {randomSpots.map((isDark, i) => (
                  <div key={i} className={`rounded-[1px] ${isDark ? 'bg-slate-950' : 'bg-transparent'}`} />
                ))}
              </div>
              <div>
                <p className="font-black text-white uppercase tracking-[0.2em] mb-1">Security Barcode</p>
                <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 inline-block">
                  <p className="font-mono text-sm text-blue-400 tracking-widest font-black uppercase">PNR: {pnr}</p>
                </div>
              </div>
           </div>
           <div className="text-right">
              <p className="text-blue-500 font-black uppercase text-3xl tracking-tighter italic">SkyLink Verified</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 italic font-medium">Digital Pass Valid: {new Date().toLocaleDateString()}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = React.useState(true);
  const [data, setData] = React.useState<BookingResponse | null>(null);
  
  const sessionId = searchParams.get('session_id');
  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/$/, "");

  React.useEffect(() => {
    if (sessionId) {
      fetch(`${API_BASE}/verify-checkout?session_id=${sessionId}`)
        .then(res => res.json())
        .then(json => {
          setData(json);
          setVerifying(false);
        })
        .catch(err => {
          console.error(err);
          setVerifying(false);
        });
    } else {
      setVerifying(false);
    }
  }, [sessionId, API_BASE]);

  if (verifying) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest animate-pulse">Verifying Payment Security...</p>
      </div>
    );
  }

  const bookingId = data?.booking_id || searchParams.get('id') || 'SKL-77421-XB';
  const pnr = searchParams.get('pnr') || 'TBD-LIVE';
  const flightNum = data?.flight?.flight_number || searchParams.get('flight') || 'SK-412';
  const origin = data?.flight?.origin || searchParams.get('from') || 'JFK';
  const destination = data?.flight?.destination || searchParams.get('to') || 'LHR';
  const seat = searchParams.get('seat') || '12A';
  const passenger = searchParams.get('name') || 'SkyLink Voyager';

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My SkyLink Boarding Pass',
          text: `Flight ${flightNum} from ${origin} to ${destination}. PNR: ${pnr}`,
          url: window.location.href
        });
      } catch (err) {
        console.error("Sharing failed", err);
      }
    } else {
      alert(`Booking Reference: ${pnr}\nFlight: ${flightNum}\nRoute: ${origin} to ${destination}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-center">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { 
            background: white !important; 
            color: black !important; 
            overflow: visible !important;
          }
          
          .print-area {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            min-height: 100vh !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}} />

      {/* 2D Unified Print Ticket - ONLY visible on print */}
      <div className="hidden print:block print-area">
        <UnifiedPrintTicket 
           bookingId={bookingId} 
           flightNum={flightNum} 
           origin={origin} 
           destination={destination} 
           seat={seat} 
           passenger={passenger} 
        />
      </div>

      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="mb-8 flex flex-col items-center no-print"
      >
        <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-5xl font-black mb-4 tracking-tight text-white">Booking Confirmed</h1>
        <div className="bg-blue-500/10 border border-blue-500/20 px-8 py-3 rounded-full inline-flex items-center gap-3 mb-6">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Booking Reference PNR:</span>
           <span className="text-xl font-black text-white font-mono tracking-widest">{pnr}</span>
        </div>
        <p className="text-slate-400 text-lg max-w-md mx-auto">Your journey is officially locked in. Your digital boarding pass has been generated below.</p>
      </motion.div>

      {/* Hover/Drag Flip 3D Holographic Boarding Pass - HIDDEN on print */}
      <div className="no-print">
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative group mb-12 perspective-[2000px] w-full max-w-3xl mx-auto h-[420px] md:h-[450px] flex items-center justify-center overflow-visible"
        >
          {/* Glow behind the card */}
          <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full opacity-40 pointer-events-none hidden md:block" />
          
          <motion.div 
            className="w-full h-[420px] md:h-[450px] relative origin-center scale-[0.75] sm:scale-90 md:scale-100"
            whileHover={{ scale: 1.02 }}
            whileDrag={{ scale: 1.05 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            style={{ transformStyle: "preserve-3d" }}
          >
             <HolographicTicket bookingId={bookingId} flightNum={flightNum} origin={origin} destination={destination} seat={seat} passenger={passenger} />
          </motion.div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 no-print">
        <button 
          onClick={handleDownload}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
        >
           <Download size={16} /> Download PDF
        </button>
        <button 
          onClick={handleShare}
          className="px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 text-white"
        >
           <Share2 size={16} /> Share Pass
        </button>
        <Link href="/dashboard" className="px-10 py-4 bg-transparent hover:text-blue-400 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 text-white">
           Go to Dashboard <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Dynamic background particles/glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
      
      <Suspense fallback={<div className="text-center pt-20 text-slate-500 uppercase tracking-widest text-sm font-black">Generating Your Pass...</div>}>
         <SuccessContent />
      </Suspense>
    </div>
  );
}
