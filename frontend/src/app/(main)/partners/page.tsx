import PageHeader from "@/components/PageHeader";

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader 
        category="Company"
        title="SkyLink Network" 
        subtitle="Collaboration is at the heart of our success. We partner with the best to deliver the best." 
      />
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 contrast-125">
           {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
             <div key={id} className="h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 grayscale">
                <span className="font-mono text-slate-500">PARTNER {id}</span>
             </div>
           ))}
        </div>
      </section>
    </main>
  );
}
