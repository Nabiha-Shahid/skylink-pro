"use client";
import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FlightSearch() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.set('origin', from.toUpperCase().trim());
    if (to) params.set('destination', to.toUpperCase().trim());
    if (date) params.set('date', date);
    params.set('passengers', passengers.toString());
    router.push(`/flights?${params.toString()}`);
  };
  return (
    <div className="w-full max-w-5xl mx-auto glass p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full" />

      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        Find Your Next Adventure
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* From */}
        <div className="space-y-2 group">
          <label htmlFor="from-input" className="text-sm font-medium text-slate-400 group-hover:text-blue-400 transition flex items-center gap-2">
            <MapPin size={16} /> From
          </label>
          <input 
            id="from-input"
            aria-label="Departure City or Airport"
            title="Departure City or Airport"
            type="text" 
            placeholder="City or Airport"
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        {/* To */}
        <div className="space-y-2 group">
          <label htmlFor="to-input" className="text-sm font-medium text-slate-400 group-hover:text-blue-400 transition flex items-center gap-2">
            <MapPin size={16} /> To
          </label>
          <input 
            id="to-input"
            aria-label="Destination City or Airport"
            title="Destination City or Airport"
            type="text" 
            placeholder="City or Airport"
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="space-y-2 group">
          <label htmlFor="date-input" className="text-sm font-medium text-slate-400 group-hover:text-blue-400 transition flex items-center gap-2">
            <Calendar size={16} /> Departure Date
          </label>
          <input 
            id="date-input"
            aria-label="Departure Date"
            title="Departure Date"
            type="date" 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Passengers */}
        <div className="space-y-2 group">
          <label htmlFor="passengers-select" className="text-sm font-medium text-slate-400 group-hover:text-blue-400 transition flex items-center gap-2">
            <Users size={16} /> Passengers
          </label>
          <select 
            id="passengers-select"
            aria-label="Number of passengers"
            title="Number of passengers"
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <button 
        onClick={handleSearch}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-95"
      >
        <Search size={20} />
        Search Flights
      </button>
    </div>
  );
}