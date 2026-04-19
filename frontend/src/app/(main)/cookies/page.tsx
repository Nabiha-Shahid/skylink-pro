import PageHeader from "@/components/PageHeader";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader 
        category="Legal"
        title="Cookie Settings" 
        subtitle="How we use cookies to personalize your SkyLink journey." 
      />
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8 glass p-12 rounded-[40px] border border-white/5">
         <h2 className="text-2xl font-bold text-white mb-6">01. Essential Cookies</h2>
         <p className="text-slate-400 text-sm leading-relaxed mb-6">
           These are required for the platform to function, such as authentication and checkout state management.
         </p>
         <h2 className="text-2xl font-bold text-white mb-6">02. Personalization</h2>
         <p className="text-slate-400 text-sm leading-relaxed">
           We use non-essential cookies to remember your preferences and provide personalized flight recommendations.
         </p>
      </section>
    </main>
  );
}
