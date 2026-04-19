import PageHeader from "@/components/PageHeader";

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader 
        category="Support"
        title="Help Center" 
        subtitle="How can we assist you today? Our team is available 24/7 to ensure your journey is perfect." 
      />
      <section className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer">
            <h3 className="text-xl font-bold mb-4 text-white">Booking</h3>
            <p className="text-slate-400 text-sm">Manage your flights, upgrades, and cancellations with ease.</p>
         </div>
         <div className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer">
            <h3 className="text-xl font-bold mb-4 text-white">Baggage</h3>
            <p className="text-slate-400 text-sm">Policy, tracking, and claims for all your luggage needs.</p>
         </div>
         <div className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer">
            <h3 className="text-xl font-bold mb-4 text-white">SkyLink Rewards</h3>
            <p className="text-slate-400 text-sm">Learn how to earn and redeem points for premium experiences.</p>
         </div>
      </section>
    </main>
  );
}
