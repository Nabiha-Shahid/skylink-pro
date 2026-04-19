"use client";
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Armchair, Plane, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';

interface Seat {
  id: string;
  type: 'economy' | 'business' | 'first';
  isOccupied: boolean;
  isLocked?: boolean;
}

interface SeatMapProps {
  onSelect: (seatId: string) => void;
  selectedSeats?: string[];
  flightId: number;
  userId?: string;
}

const TELEMETRY_URL = "http://localhost:4000";

export default function SeatMap({ onSelect, selectedSeats = [], flightId, userId }: SeatMapProps) {
  const [lockedSeats, setLockedSeats] = useState<Record<string, string>>({});
  const socketRef = useRef<Socket | null>(null);

  const rows = 10;
  const cols = useMemo(() => ['A', 'B', 'C', '', 'D', 'E', 'F'], []);

  useEffect(() => {
    const newSocket = io(TELEMETRY_URL);
    socketRef.current = newSocket;

    newSocket.emit('joinFlight', flightId);

    newSocket.on('seatStatusUpdate', ({ seatId, status, userId: lockOwner }) => {
      setLockedSeats(prev => {
        const next = { ...prev };
        if (status === 'locked') {
          next[seatId] = lockOwner;
        } else {
          delete next[seatId];
        }
        return next;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [flightId]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isOccupied || (lockedSeats[seat.id] && lockedSeats[seat.id] !== userId)) return;
    
    // If not already locked by us, try to lock it
    if (!lockedSeats[seat.id] && socketRef.current) {
      socketRef.current.emit('lockSeat', { flightId, seatId: seat.id, userId });
    }
    
    onSelect(seat.id);
  };

  const seatGrid = useMemo(() => {
    return Array.from({ length: rows }).map((_, r) => {
      const rowIndex = r + 1;
      return cols.map((col) => {
        if (!col) return null;
        const id = `${rowIndex}${col}`;
        const isOccupied = (r * 7 + col.charCodeAt(0)) % 5 === 0;
        const type = (r < 2 ? 'first' : r < 4 ? 'business' : 'economy') as Seat['type'];
        return { 
          id, 
          isOccupied, 
          type, 
          isLocked: !!lockedSeats[id] && lockedSeats[id] !== userId 
        };
      });
    });
  }, [rows, cols, lockedSeats, userId]);

  const getSeatStyles = (seat: Seat) => {
    if (seat.isOccupied) return 'text-slate-800 bg-slate-900/50 cursor-not-allowed opacity-30';
    if (seat.isLocked) return 'text-slate-500 bg-slate-800/50 cursor-not-allowed border-slate-700';
    if (selectedSeats.includes(seat.id)) return 'text-white bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]';
    
    switch (seat.type) {
      case 'first': return 'text-amber-400 bg-amber-400/5 hover:bg-amber-400/20 border-amber-400/20';
      case 'business': return 'text-purple-400 bg-purple-400/5 hover:bg-purple-400/20 border-purple-400/20';
      default: return 'text-slate-400 bg-slate-400/5 hover:bg-white/10 border-white/5';
    }
  };

  return (
    <div className="relative py-8">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-white/10 to-transparent rounded-t-full border-t border-white/10 flex items-end justify-center pb-4">
         <Plane className="text-white/10" size={32} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-center gap-3 mb-4">
          <div className="w-6" />
          {cols.map((col, idx) => (
            col ? <div key={idx} className="w-10 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">{col}</div> : <div key={idx} className="w-8" />
          ))}
        </div>

        {seatGrid.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-3 items-center group">
            <span className="w-6 text-[10px] font-black text-slate-700 group-hover:text-blue-500 transition-colors uppercase tracking-widest">{rIdx + 1}</span>
            {row.map((seat, cIdx) => {
              if (!seat) return <div key={cIdx} className="w-8" />;
              
              return (
                <motion.button
                  key={cIdx}
                  whileHover={(!seat.isOccupied && !seat.isLocked) ? { scale: 1.1 } : {}}
                  whileTap={(!seat.isOccupied && !seat.isLocked) ? { scale: 0.95 } : {}}
                  onClick={() => handleSeatClick(seat)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${getSeatStyles(seat)} ${seat.isLocked ? 'animate-pulse' : ''}`}
                  disabled={seat.isOccupied || seat.isLocked}
                >
                  {seat.isLocked ? <Lock size={14} className="text-slate-600" /> : <Armchair size={18} className={selectedSeats.includes(seat.id) ? "fill-white" : ""} />}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-800" /> Occupied</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full animate-pulse bg-slate-600" /> Pending</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /> First</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-400" /> Business</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400" /> Economy</div>
      </div>

      {selectedSeats.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center"
        >
           <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-1">
             Assigned Seat{selectedSeats.length > 1 ? 's' : ''}
           </p>
           <p className="text-3xl font-black text-white">{selectedSeats.join(', ')}</p>
        </motion.div>
      )}
    </div>
  );
}