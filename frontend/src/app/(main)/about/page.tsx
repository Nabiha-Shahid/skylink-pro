import PageHeader from "@/components/PageHeader";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader 
        category="Company"
        title="Elevating Aviation" 
        subtitle="SkyLink is at the forefront of the next generation of air travel, blending AI-driven precision with unmatched luxury." 
      />
      
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="glass p-12 rounded-[40px] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl group-hover:bg-blue-600/20 transition-all duration-500" />
          <h2 className="text-3xl font-bold mb-6 text-white leading-tight">Our Mission</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Founded with a vision to redefine the skies, SkyLink leverages advanced machine learning and agentic workflows to optimize every aspect of the passenger journey. From dynamic pricing models that ensure the best value to personalized in-flight services, we are building the future of aviation today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-blue-400">Innovation</h3>
              <p className="text-slate-400">Continuous integration of cutting-edge technology for safety, speed, and comfort.</p>
           </div>
           <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-blue-400">Excellence</h3>
              <p className="text-slate-400">Uncompromising standards in service and operations for the global elite traveller.</p>
           </div>
        </div>
      </section>
    </main>
  );
}
