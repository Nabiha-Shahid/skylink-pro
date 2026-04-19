import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  category?: string;
}

export default function PageHeader({ title, subtitle, category }: PageHeaderProps) {
  return (
    <div className="relative pt-24 pb-16 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto text-center">
        {category && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            {category}
          </div>
        )}
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent tracking-tighter uppercase">
          {title}
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
