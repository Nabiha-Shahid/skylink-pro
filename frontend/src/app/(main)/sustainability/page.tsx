import PageHeader from "@/components/PageHeader";

export default function SustainabilityPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader 
        category="Company"
        title="Eco Innovation" 
        subtitle="SkyLink is committed to a future where high-performance aviation meets environmental responsibility." 
      />
      
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="glass p-12 rounded-[40px] border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl group-hover:bg-green-500/20 transition-all duration-500" />
           <h2 className="text-3xl font-bold mb-6 text-white leading-tight">Net Zero 2030</h2>
           <p className="text-slate-400 text-lg leading-relaxed mb-6">
             Our mission is to achieve net carbon neutrality by 2030. This isn&apos;t just a goal; it&apos;s a commitment to future generations. We are investing in sustainable aviation fuel (SAF), carbon capture technology, and next-generation aircraft design that maximizes efficiency.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                 <h4 className="font-bold text-green-400 mb-2">SAF Integration</h4>
                 <p className="text-sm text-slate-400 leading-relaxed">Transitioning our fleet to sustainable fuels derived from 100% renewable sources.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                 <h4 className="font-bold text-green-400 mb-2">Fleet Optimization</h4>
                 <p className="text-sm text-slate-400 leading-relaxed">Using AI to calculate optimal flight paths, reducing fuel burn by an average of 15%.</p>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
