"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PlaneTakeoff, PlaneLanding, Search, ShieldCheck, Zap, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SeatMap from "@/components/SeatMap";

interface Flight {
  id: number;
  flight_number: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  base_price: number;
  capacity: number;
  available_seats: number;
  status: string;
  delay_probability: number;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/$/, "");

function FlightsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL parameters for initial load (Now includes flight_no)
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const flightNoParam = searchParams.get('flight_no') || '';

  // Local state for the Search Bar
  const [searchOrigin, setSearchOrigin] = useState(origin);
  const [searchDest, setSearchDest] = useState(destination);
  const [searchFlightNo, setSearchFlightNo] = useState(flightNoParam);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { user } = useAuth();
  const [postgresUserId, setPostgresUserId] = useState<number | null>(null);
  
  // Booking State
  const [bookingFlight, setBookingFlight] = useState<Flight | null>(null);
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerTitle, setPassengerTitle] = useState("mr");
  const [passengerGender, setPassengerGender] = useState("male");
  const [passengerBornOn, setPassengerBornOn] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [lockTimer, setLockTimer] = useState<number | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);

  // Fetch Flights (Now tracks flightNoParam as well)
  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setFetchError(null);
      const params = new URLSearchParams();
      if (origin) params.append("origin", origin);
      if (destination) params.append("destination", destination);
      if (flightNoParam) params.append("flight_no", flightNoParam); // Sends to API if supported

      const url = `${API_BASE}/flights?${params.toString()}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setFlights(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        const error = err as Error;
        console.error("Flight scanning failure!");
        console.error("Attempted URL:", url);
        console.error("Error details:", error);
        setFetchError(error.message || "Failed to scan global flight grid.");
        setLoading(false);
      }
    };

    fetchFlights();
  }, [origin, destination, flightNoParam]);

  // Fetch User ID
  useEffect(() => {
    if (user) {
      fetch(`${API_BASE}/users/me/dashboard?firebase_uid=${user.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.user && data.user.id) {
            setPostgresUserId(data.user.id);
          }
        })
        .catch(err => console.error("User fetch failed:", err));
    }
  }, [user]);

  // Search Function (Now updates URL with all 3 parameters)
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchOrigin) params.append("origin", searchOrigin.toUpperCase().trim());
    if (searchDest) params.append("destination", searchDest.toUpperCase().trim());
    if (searchFlightNo) params.append("flight_no", searchFlightNo);
    
    // Updates the URL, which triggers the useEffect above to fetch new flights
    router.push(`/flights?${params.toString()}`);
  };

  const handleBookInitiate = (flight: Flight) => {
    if (!user) {
      router.push(`/login?redirect=/flights?${searchParams.toString()}`);
      return;
    }
    setBookingFlight(flight);
    setPassengerName(user.displayName || "");
    setPassengerEmail(user.email || "");
  };

  // Timer Logic
  useEffect(() => {
    if (lockTimer === null) return;
    if (lockTimer <= 0) {
      setTimerExpired(true);
      setShowSeatMap(false);
      setBookingFlight(null);
      setSelectedSeats([]);
      setLockTimer(null);
      return;
    }

    const interval = setInterval(() => {
      setLockTimer(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [lockTimer]);

  const handleSeatSelect = (seatId: string) => {
    // For this simple version, we only allow one seat at a time as requested
    setSelectedSeats([seatId]);
    
    // Start/Reset the 5-minute timer (300 seconds)
    setLockTimer(300);
    setTimerExpired(false);
  };

  // --- NEW VALIDATION FUNCTION ADDED HERE ---
  const handleSelectSeatsProceed = () => {
    if (!passengerEmail || !passengerEmail.includes('@')) {
      alert("Please enter a valid email address before proceeding.");
      return;
    }
    
    if (!passengerName.trim()) {
      alert("Please enter your full name before proceeding.");
      return;
    }

    if (!passengerBornOn) {
      alert("Please enter your date of birth before proceeding.");
      return;
    }

    if (!passengerPhone.trim()) {
      alert("Please enter your phone number before proceeding.");
      return;
    }

    setShowSeatMap(true);
  };

  const handleCheckout = async () => {
    if (!bookingFlight || !postgresUserId) return;

    setIsBooking(true);
    try {
      // For this high-fidelity demo, we'll create the booking and live Duffel order FIRST
      const payload = {
        user_id: postgresUserId,
        flight_id: bookingFlight.id,
        seat_number: selectedSeats.length > 0 ? selectedSeats.join(", ") : "TBD",
        status: "confirmed",
        total_price: bookingFlight.base_price * (selectedSeats.length > 0 ? selectedSeats.length : 1),
        passenger_name: passengerName,
        passenger_email: passengerEmail,
        passenger_title: passengerTitle,
        gender: passengerGender,
        born_on: passengerBornOn,
        passenger_phone: passengerPhone
      };

      const bookRes = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (bookRes.ok) {
        const result = await bookRes.json();
        // Redirect to success page with real metadata and PNR
        const successParams = new URLSearchParams();
        successParams.set("id", result.id.toString());
        successParams.set("pnr", result.duffel_order_id || "SKL-OFFLINE");
        successParams.set("flight", bookingFlight.flight_number);
        successParams.set("from", bookingFlight.origin);
        successParams.set("to", bookingFlight.destination);
        successParams.set("seat", payload.seat_number);
        successParams.set("name", passengerName);
        
        router.push(`/success?${successParams.toString()}`);
        return;
      }

      // Fallback to Stripe if preferred or if Duffel fails in certain modes
      const res = await fetch(`${API_BASE}/create-checkout-session?flight_id=${bookingFlight.id}`, {
        method: "POST"
      });

      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Booking engine encountered a critical error. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  // Filter flights locally based on Origin, Destination, AND Flight Number
  const displayedFlights = flights.filter(f => {
    const matchOrigin = searchOrigin === "" || f.origin.toLowerCase().includes(searchOrigin.toLowerCase());
    const matchDest = searchDest === "" || f.destination.toLowerCase().includes(searchDest.toLowerCase());
    const matchFlightNo = searchFlightNo === "" || f.flight_number.toLowerCase().includes(searchFlightNo.toLowerCase());
    
    return matchOrigin && matchDest && matchFlightNo;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <span className="text-blue-500 font-mono text-xs uppercase tracking-widest mb-2 block">Live Flight Engine</span>
        <h1 className="text-5xl font-black mb-4 tracking-tight">Available Flights</h1>
        <p className="text-slate-400 text-lg">
          Exclusive yields found for <span className="text-white font-bold">{origin || 'Global'}</span> to <span className="text-white font-bold">{destination || 'Destinations'}</span>.
        </p>
      </motion.div>

      {/* STICKY SEARCH BAR */}
      <div className="sticky top-24 z-40 mb-12 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full p-2 flex flex-col md:flex-row items-center gap-2 md:gap-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Origin Input */}
        <div className="flex-1 w-full flex items-center px-6 md:border-r border-white/10 py-2">
          <PlaneTakeoff size={18} className="text-slate-500 mr-3" />
          <input
            type="text"
            placeholder="From (e.g. JFK)"
            value={searchOrigin}
            onChange={(e) => setSearchOrigin(e.target.value)}
            className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-slate-600 outline-none text-sm font-medium"
          />
        </div>

        {/* Destination Input */}
        <div className="flex-1 w-full flex items-center px-6 md:border-r border-white/10 py-2">
          <PlaneLanding size={18} className="text-slate-500 mr-3" />
          <input
            type="text"
            placeholder="To (e.g. LHR)"
            value={searchDest}
            onChange={(e) => setSearchDest(e.target.value)}
            className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-slate-600 outline-none text-sm font-medium"
          />
        </div>

        {/* Flight Number Input */}
        <div className="flex-1 w-full flex items-center px-6 py-2">
          <Search size={18} className="text-slate-500 mr-3" />
          <input
            type="text"
            placeholder="Flight no. (e.g. SK7701)"
            value={searchFlightNo}
            onChange={(e) => setSearchFlightNo(e.target.value)}
            className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-slate-600 outline-none text-sm font-medium uppercase"
          />
        </div>

        {/* Search/Found Button */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          <Search size={14} />
          {displayedFlights.length > 0 ? `${displayedFlights.length} FOUND` : 'SEARCH'}
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-500 rounded-full animate-spin shadow-[0_0_30px_rgba(37,99,235,0.2)]"></div>
          <p className="text-slate-500 font-medium animate-pulse">Scanning routes...</p>
        </div>
      ) : fetchError ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-16 text-center rounded-[2.5rem] border border-red-500/10 flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-red-600/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-500">
            <X size={40} />
          </div>
          <div>
            <p className="text-2xl font-bold mb-2">Navigation Link Failure</p>
            <p className="text-slate-500 italic mb-6">{fetchError}</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
          >
            Retry Route Scan
          </button>
        </motion.div>
      ) : displayedFlights.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-16 text-center rounded-[2.5rem] border border-white/5"
        >
          <p className="text-2xl font-bold mb-6">No flights discovered for this route.</p>
          <button
            type="button"
            onClick={() => { setSearchOrigin(""); setSearchDest(""); setSearchFlightNo(""); router.push('/flights'); }}
            className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
          >
            Clear Search
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {displayedFlights.map((flight, idx) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex flex-col xl:flex-row justify-between items-center gap-8">
                  <div className="flex-1 flex justify-between items-center w-full max-w-3xl">
                    <div className="text-left">
                      <p className="text-4xl font-black mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tighter">{flight.origin}</p>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                        {new Date(flight.departure_time).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-8">
                      <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full mb-3 border border-blue-500/20 uppercase tracking-widest">{flight.flight_number}</span>
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent relative">
                        <PlaneTakeoff size={20} className="absolute -top-[10px] left-1/2 -translate-x-1/2 text-blue-400 group-hover:translate-x-4 transition-transform duration-700" />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter italic">Non-stop // 2h 45m</span>
                    </div>

                    <div className="text-right">
                      <p className="text-4xl font-black mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tighter">{flight.destination}</p>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                        {new Date(flight.arrival_time).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="hidden xl:block w-px h-16 bg-white/5"></div>

                  <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between w-full xl:w-64 gap-4">
                    <div className="text-left xl:text-right">
                      <p className={`text-xs font-bold mb-1 flex items-center gap-1.5 ${flight.delay_probability > 0.3 ? 'text-yellow-500' : 'text-green-400'}`}>
                        {flight.delay_probability > 0.3 ? <ShieldCheck size={14} /> : <Zap size={14} className="fill-green-400/20" />}
                        {flight.delay_probability > 0.3 ? 'Delays Possible' : 'On-Time Priority'}
                      </p>
                      <p className="text-4xl font-black text-white">${flight.base_price.toFixed(0)}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBookInitiate(flight)}
                      className="px-10 py-4 bg-blue-600 hover:bg-white hover:text-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] active:scale-95 flex items-center gap-2 group/btn"
                    >
                      Book Now
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Booking Checkout Flow */}
      <AnimatePresence>
        {bookingFlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md px-6 py-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass max-w-2xl w-full max-h-[95vh] overflow-y-auto custom-scrollbar p-8 md:p-12 rounded-[3rem] border border-blue-500/20 shadow-[0_0_100px_rgba(37,99,235,0.1)] relative"
            >
              <button
                type="button"
                aria-label="Close booking modal"
                onClick={() => { setBookingFlight(null); setShowSeatMap(false); setSelectedSeats([]); }}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition z-10"
              >
                <X size={24} />
              </button>

              <div className="mb-10 text-center">
                <h3 className="text-3xl font-black mb-3">Finalize Booking</h3>
                <div className="inline-flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-xs">
                  <span>{bookingFlight.origin}</span>
                  <ArrowRight size={14} />
                  <span>{bookingFlight.destination}</span>
                </div>
              </div>

              {!showSeatMap ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="passenger-name" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                        Full Name
                      </label>
                      <input
                        id="passenger-name"
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition text-white font-medium"
                      />
                    </div>
                    <div>
                      <label htmlFor="passenger-email" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                        Email Address
                      </label>
                      <input
                        id="passenger-email"
                        type="email"
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition text-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="passenger-title" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                        Title
                      </label>
                      <select
                        id="passenger-title"
                        value={passengerTitle}
                        onChange={(e) => setPassengerTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition text-white font-medium"
                      >
                        <option value="mr">Mr</option>
                        <option value="ms">Ms</option>
                        <option value="mrs">Mrs</option>
                        <option value="dr">Dr</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="passenger-gender" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                        Gender
                      </label>
                      <select
                        id="passenger-gender"
                        value={passengerGender}
                        onChange={(e) => setPassengerGender(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition text-white font-medium"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="passenger-born-on" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                        Date of Birth
                      </label>
                      <input
                        id="passenger-born-on"
                        type="date"
                        value={passengerBornOn}
                        onChange={(e) => setPassengerBornOn(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition text-white font-medium"
                      />
                    </div>
                    <div>
                      <label htmlFor="passenger-phone" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                        Phone Number
                      </label>
                      <input
                        id="passenger-phone"
                        type="tel"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        placeholder="+1 555 123 4567"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition text-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 mb-8">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold text-blue-100">Fare Summary</p>
                      <p className="text-2xl font-black text-blue-400">${bookingFlight.base_price.toFixed(2)}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectSeatsProceed}
                    disabled={!passengerEmail || !passengerEmail.includes('@') || !passengerName.trim() || !passengerBornOn || !passengerPhone}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl ${
                      (!passengerEmail || !passengerEmail.includes('@') || !passengerName.trim() || !passengerBornOn || !passengerPhone) 
                        ? 'bg-white/20 text-slate-400 cursor-not-allowed' 
                        : 'bg-white text-slate-950 hover:bg-blue-400'
                    }`}
                  >
                    Select Seats
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {lockTimer !== null && (
                    <div className="flex items-center justify-between px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                        <Zap size={14} className="animate-pulse" />
                        Seat held for:
                      </p>
                      <p className="font-mono text-lg font-black text-white">
                        {Math.floor(lockTimer / 60)}:{(lockTimer % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                  )}

                  <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    <SeatMap
                      onSelect={handleSeatSelect}
                      selectedSeats={selectedSeats}
                      flightId={bookingFlight.id}
                      userId={user?.uid}
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSeatMap(false)}
                      className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={selectedSeats.length === 0 || isBooking}
                      onClick={handleCheckout}
                      className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-xs transition shadow-lg disabled:opacity-30 flex justify-center items-center"
                    >
                      {isBooking
                        ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        : `Checkout With Stripe ($${(bookingFlight.base_price * (selectedSeats.length > 0 ? selectedSeats.length : 1)).toFixed(0)})`
                      }
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Expiry Warning */}
      <AnimatePresence>
        {timerExpired && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl px-6"
          >
            <motion.div 
               initial={{ scale: 0.9, y: 30 }}
               animate={{ scale: 1, y: 0 }}
               className="glass max-w-md w-full p-12 rounded-[3.5rem] border border-amber-500/20 text-center"
            >
              <div className="w-20 h-20 bg-amber-600/10 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-8">
                 <Zap size={40} />
              </div>
              <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase">Session Expired</h3>
              <p className="text-slate-500 text-sm mb-12 italic leading-relaxed">The temporary lock on your seat has expired. To maintain security and fairness, the seat has been released back to the global pool.</p>
              <button 
                onClick={() => setTimerExpired(false)} 
                className="w-full py-6 bg-amber-500 hover:bg-amber-400 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl"
              >
                Return to Flights
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-12 text-center text-slate-400">Booting route engines...</div>}>
      <div className="min-h-screen pt-32 pb-12 bg-slate-950 text-slate-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 opacity-50 pointer-events-none"></div>
        <FlightsContent />
      </div>
    </Suspense>
  )
}