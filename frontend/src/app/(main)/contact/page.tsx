import PageHeader from "@/components/PageHeader";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader 
        category="Support"
        title="Contact Us" 
        subtitle="Our global support network is ready to help at a moment's notice." 
      />
      
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="glass p-12 rounded-[40px] border border-white/5 space-y-8">
           <h2 className="text-3xl font-bold mb-6 text-white leading-tight">Send a Message</h2>
           <form className="space-y-6">
              {[
                { label: "Full Name", placeholder: "Sky Walker", type: "text" },
                { label: "Email Address", placeholder: "sky@example.com", type: "email" },
                { label: "Booking Reference", placeholder: "ABC123XYZ", type: "text" }
              ].map((field, idx) => (
                 <div key={idx} className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600" />
                 </div>
              ))}
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Message</label>
                 <textarea rows={4} placeholder="How can we help?" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 resize-none" />
              </div>
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-bold transition-all shadow-lg shadow-blue-900/20">Submit Ticket</button>
           </form>
        </div>

        <div className="space-y-8">
           <div className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Global Support</h3>
              <p className="text-slate-400 text-sm mb-4">24/7 Premium Concierge</p>
              <p className="text-2xl font-mono text-white">+1 (800) SKYLINK-HQ</p>
           </div>
           <div className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all">
              <h4 className="text-lg font-bold text-white mb-2">Corporate HQ</h4>
              <p className="text-slate-400 text-sm leading-relaxed">SkyLink Aviation Tower<br />Aerospace Plaza, One Aviation Way<br />San Francisco, CA 94103</p>
           </div>
        </div>
      </section>
    </main>
  );
}
