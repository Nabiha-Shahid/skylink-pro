import PageHeader from "@/components/PageHeader";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader 
        category="Legal"
        title="Privacy Policy" 
        subtitle="Your data security is as important as your flight safety." 
      />
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8 glass p-12 rounded-[40px] border border-white/5">
         <h2 className="text-2xl font-bold text-white mb-6">01. Data Collection</h2>
         <p className="text-slate-400 text-sm leading-relaxed mb-6">
           We collect personal information to provide you with the most efficient booking experience. This includes name, email, and payment information securely stored via Firebase and Stripe.
         </p>
         <h2 className="text-2xl font-bold text-white mb-6">02. Usage</h2>
         <p className="text-slate-400 text-sm leading-relaxed">
           Your data is used to optimize flight yield and personalization for your journey. We never sell your data to third parties.
         </p>
      </section>
    </main>
  );
}
