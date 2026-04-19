import PageHeader from "@/components/PageHeader";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader 
        category="Legal"
        title="Terms of Service" 
        subtitle="The agreement between SkyLink and our valued passengers." 
      />
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8 glass p-12 rounded-[40px] border border-white/5">
         <h2 className="text-2xl font-bold text-white mb-6">01. Acceptance</h2>
         <p className="text-slate-400 text-sm leading-relaxed mb-6">
           By using the SkyLink platform, you agree to comply with our conditions of carriage and digital terms.
         </p>
         <h2 className="text-2xl font-bold text-white mb-6">02. Booking & Cancellation</h2>
         <p className="text-slate-400 text-sm leading-relaxed">
           All bookings are subject to availability and our dynamic pricing algorithms. Cancellations are subject to the fare tier policies.
         </p>
      </section>
    </main>
  );
}
