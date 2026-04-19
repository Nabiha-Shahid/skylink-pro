import PageHeader from "@/components/PageHeader";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader 
        category="Support"
        title="Common Questions" 
        subtitle="Quick answers to your most pressing inquiries about the SkyLink experience." 
      />
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {[
          { q: "How do I use AI dynamic pricing?", a: "Our AI engine automatically calculates the best fare based on global trends. You don't need to do anything—you'll always see the most optimized price at checkout." },
          { q: "What is the baggage limit for First Class?", a: "First Class passengers enjoy an unlimited baggage allowance, subject to safety and weight limits of 32kg per piece." },
          { q: "Can I pay with multi-currency?", a: "Yes, our Stripe integration supports over 135+ currencies with real-time conversion rates." }
        ].map((faq, idx) => (
           <div key={idx} className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all">
              <h3 className="text-xl font-bold text-white mb-4">{faq.q}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
           </div>
        ))}
      </section>
    </main>
  );
}
