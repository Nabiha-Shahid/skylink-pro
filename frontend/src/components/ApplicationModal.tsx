"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, AlertCircle, Briefcase, User, Mail, Globe } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/$/, "");

export default function ApplicationModal({ isOpen, onClose, jobTitle }: ApplicationModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState("");
  const [appId, setAppId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      setErrorMsg("Please upload your resume.");
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg("");

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("portfolio_url", portfolioUrl);
    formData.append("job_title", jobTitle);
    formData.append("resume", resume);

    try {
      const response = await fetch(`${API_BASE}/applications/submit`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Submission Failure Status:", response.status);
        console.error("Submission Failure Message:", errorText);
        throw new Error(`Failed to submit application: ${response.statusText}`);
      }

      const data = await response.json();
      setAppId(data.application_id);
      setStatus('success');
    } catch (err) {
      const error = err as Error;
      console.error("Application submission logic error:", error);
      setErrorMsg(error.message || "An unexpected uplink failure occurred.");
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass max-w-xl w-full p-8 md:p-12 rounded-[2.5rem] border border-white/10 relative overflow-hidden"
          >
            <button
              aria-label="Close application modal"
              onClick={onClose}
              className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {status === 'success' ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center text-green-500 mx-auto shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <CheckCircle size={40} />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">Mission Accepted</h3>
                  <p className="text-slate-400 italic">Your application for <span className="text-white font-bold">{jobTitle}</span> has been received.</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Reference ID</p>
                  <p className="text-2xl font-black text-blue-400 tracking-widest">{appId}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/90 transition-all"
                >
                  Return to Base
                </button>
              </div>
            ) : (
              <>
                <div className="mb-10 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                     <Briefcase className="text-blue-500" size={20} />
                     <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px]">Open Operative Role</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">{jobTitle}</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                          required
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-white font-medium"
                          placeholder="Commander Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-white font-medium"
                          placeholder="comm-link@skylink.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Portfolio / LinkedIn Profile</label>
                     <div className="relative">
                       <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                       <input
                         required
                         type="url"
                         value={portfolioUrl}
                         onChange={(e) => setPortfolioUrl(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-white font-medium"
                         placeholder="https://portfolio.com or https://linkedin.com/in/..."
                       />
                     </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Resume / CV (PDF, DOCX)</label>
                    <label className="w-full h-32 bg-white/5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group overflow-hidden relative">
                      <input
                        required
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResume(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      {resume ? (
                        <div className="text-center group-hover:scale-110 transition-transform">
                          <CheckCircle className="text-green-500 mx-auto mb-2" size={24} />
                          <p className="text-sm font-bold text-white max-w-[200px] truncate">{resume.name}</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="text-slate-500 mb-2 group-hover:text-blue-400 group-hover:-translate-y-1 transition-all" size={24} />
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload Intelligence</p>
                        </>
                      )}
                    </label>
                  </div>

                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold italic"
                    >
                      <AlertCircle size={14} />
                      {errorMsg}
                    </motion.div>
                  )}

                  <button
                    disabled={status === 'loading'}
                    type="submit"
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center justify-center"
                  >
                    {status === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : "Submit Intelligence"}
                  </button>
                </form>
              </>
            )}
            
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-600/5 blur-[100px] pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
