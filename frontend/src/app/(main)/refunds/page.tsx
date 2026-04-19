import PageHeader from "@/components/PageHeader";

export default function RefundsPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader 
        category="Support"
        title="Refund Policy" 
        subtitle="Transparent and flexible refund policies designed for the discerning traveler." 
      />
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="glass p-12 rounded-[40px] border border-white/5 space-y-8">
           <div className="space-y-4">
              <h3 className="text-xl font-bold font-mono text-blue-400">01 / FLEXIBILITY</h3>
              <p className="text-slate-400 leading-relaxed">Cancel within 24 hours of booking for a full refund, no questions asked. For bookings made at least 7 days before departure.</p>
           </div>
           <div className="space-y-4">
              <h3 className="text-xl font-bold font-mono text-blue-400">02 / PREMIUM FARES</h3>
              <p className="text-slate-400 leading-relaxed">Our First Class and Business Elite fares are fully refundable up to 48 hours before departure. SkyLink credits are issued for late cancellations.</p>
           </div>
           <div className="space-y-4">
              <h3 className="text-xl font-bold font-mono text-blue-400">03 / PROCESSING</h3>
              <p className="text-slate-400 leading-relaxed">Refunds are processed within 3-5 business days back to the original payment method, powered by Stripe security.</p>
           </div>
        </div>
      </section>
    </main>
  );
}
