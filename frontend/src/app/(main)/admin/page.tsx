"use client";
import { TrendingUp, Users, DollarSign, Plane } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Revenue (MTD)', value: '$2,450,890', change: '+12.5%', icon: <DollarSign className="text-emerald-400" /> },
    { name: 'Average RASM', value: '$0.154', change: '+2.1%', icon: <TrendingUp className="text-blue-400" /> },
    { name: 'Active Bookings', value: '12,405', change: '+4.3%', icon: <Plane className="text-amber-400" /> },
    { name: 'Yield Multiplier', value: '1.24x', change: '+0.12', icon: <Users className="text-purple-400" /> },
  ];

  return (
    <main className="min-h-screen bg-slate-950 pt-32 px-6 pb-20 selection:bg-blue-500/30">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black mb-2 tracking-tight text-white">
            SkyLink <span className="text-blue-500">Analytics</span>
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Real-time airline yields, network metrics, and dynamic pricing telemetry. 
            System status: <span className="text-emerald-500 font-mono text-sm">● Operational</span>
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.name} className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 group cursor-default">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                  {stat.icon}
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">{stat.name}</h3>
              <p className="text-3xl font-bold tracking-tight text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Analytics Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Revenue Curve Simulation */}
           <div className="glass p-10 rounded-3xl h-[450px] flex flex-col border border-white/5">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-bold text-white">Revenue Projections</h3>
                  <p className="text-xs text-slate-500 mt-1">90-Day Expected Yield Curve</p>
                </div>
                <div className="flex gap-2">
                   <div className="w-8 h-2 rounded-full bg-blue-500" />
                   <div className="w-8 h-2 rounded-full bg-slate-800" />
                </div>
              </div>
              
              <div className="flex-1 flex items-end justify-between gap-2 px-2">
                {[40, 55, 62, 58, 70, 85, 80, 92, 88, 75, 95, 100].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-500/60 rounded-t-lg transition-all duration-500 hover:to-white hover:scale-105 cursor-pointer group relative" 
                    style={{ height: `${h}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${h * 24}k
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest px-2 border-t border-white/5 pt-4">
                 <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span>
              </div>
           </div>

           {/* ML Feedback Console */}
           <div className="glass p-10 rounded-3xl h-[450px] flex flex-col overflow-hidden border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xl font-bold text-white">Pricing Telemetry System</h3>
              </div>
              
              <div className="flex-1 space-y-4 font-mono text-[11px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                <div className="flex gap-4 text-emerald-400">
                  <span className="opacity-40">[22:31:02]</span>
                  <span>ADJUSTING FARE JFK-LHR // DEMAND_FACTOR: 1.24x // OPTIMIZED</span>
                </div>
                <div className="flex gap-4 text-slate-400">
                  <span className="opacity-40">[22:31:05]</span>
                  <span>PREDICTING DELAY // FLIGHT BA001 // PROBABILITY 0.08 // LOW RISK</span>
                </div>
                <div className="flex gap-4 text-amber-400">
                  <span className="opacity-40">[22:31:08]</span>
                  <span>YIELD COMPRESSION ALERT // SECTOR DXB-SIN // REMAINING: 4 SEATS</span>
                </div>
                <div className="flex gap-4 text-emerald-400">
                  <span className="opacity-40">[22:31:12]</span>
                  <span>FARE UPDATE DXB-SIN // NEW_PRICE: $1,405.00 // +15%</span>
                </div>
                <div className="flex gap-4 text-blue-400">
                  <span className="opacity-40">[22:31:20]</span>
                  <span>STRIPE_WEBHOOK: PAYMENT_INTENT_SUCCESS // ID: pi_12345...</span>
                </div>
                <div className="flex gap-4 text-slate-500 italic">
                  <span className="opacity-40">[22:31:25]</span>
                  <span>SYSTEM_HEALTH: NOMINAL // ALL_NODES_ONLINE // LATENCY 42ms</span>
                </div>
                {/* Adding more lines for scroll testing */}
                <div className="flex gap-4 text-slate-500 italic">
                  <span className="opacity-40">[22:31:30]</span>
                  <span>REBALANCING_LOAD // CLUSTER_B // SUCCESS</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}