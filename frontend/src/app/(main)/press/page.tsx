import PageHeader from "@/components/PageHeader";

export default function PressPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader 
        category="Company"
        title="SkyLink Press" 
        subtitle="Latest news and updates from the frontline of aviation technology." 
      />
      
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { date: "April 2026", title: "SkyLink AI Engine Achieves Record Efficiency", slug: "efficiency" },
             { date: "March 2026", title: "New Route: San Francisco to Dubai Non-Stop", slug: "routes" },
             { date: "February 2026", title: "SkyLink Partners with Major Tech Hubs", slug: "partnerships" },
             { date: "January 2026", title: "Sustainability Milestone: Carbon Neutrality by 2030", slug: "sustainability" }
           ].map((news, idx) => (
              <div key={idx} className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                  <span className="text-xs font-bold text-blue-500 mb-2 block tracking-widest">{news.date}</span>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors leading-tight">{news.title}</h3>
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    Read Story 
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </div>
              </div>
           ))}
        </div>
      </section>
    </main>
  );
}
