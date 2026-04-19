"use client";
import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import ApplicationModal from "@/components/ApplicationModal";

export default function CareersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");

  const handleApply = (title: string) => {
    setSelectedJob(title);
    setIsModalOpen(true);
  };

  const roles = [
    { title: "ML Dynamic Pricing Lead", location: "Global / Remote" },
    { title: "Senior Agentic AI Engineer", location: "San Francisco, CA" },
    { title: "Frontend Visionary (Next.js)", location: "London / Hybrid" },
    { title: "Operations & Flight Yield Manager", location: "Dubai, UAE" }
  ];

  return (
    <main className="min-h-screen bg-slate-950">
      <PageHeader
        category="Company"
        title="Join the Future"
        subtitle="Be part of a team that's building the next generation of airline experiences."
      />

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="glass p-12 rounded-[40px] border border-white/5 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl pointer-events-none" />

          <h2 className="text-3xl font-bold mb-6 text-white text-center md:text-left uppercase tracking-tight">Open Roles</h2>

          <div className="space-y-4">
            {roles.map((role, idx) => (
              <div
                key={idx}
                onClick={() => handleApply(role.title)}
                className="flex flex-col md:flex-row justify-between items-center p-8 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group cursor-pointer"
              >
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">{role.location}</p>
                </div>

                <button
                  type="button"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-blue-900/20"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-500 italic">Built for the bold. Join us in redefining the skies.</p>
        </div>
      </section>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={selectedJob}
      />
    </main>
  );
}