"use client";

import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  Sparkles,
  Cpu,
  FileText,
  Search,
  Download,
  Zap,
  CheckCircle2,
  Brain,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function LandingBentoFeatures() {
  return (
    <section className="relative z-10 py-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/70 via-slate-50 to-white text-slate-900 overflow-hidden">
      {/* Background ambient sky glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50/80 px-4 py-1.5 text-xs font-semibold text-sky-700 mb-4 shadow-xs">
          <Sparkles className="size-3.5 text-sky-500" />
          <span>Powered by Vector AI Intelligence</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Recruiting intelligence built for{" "}
          <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            modern talent teams
          </span>
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-base text-slate-600 leading-relaxed">
          Stop scrolling through generic PDFs. Altitude contextually parses candidate resumes and delivers ranked candidate matches in seconds.
        </p>
      </div>

      {/* Aceternity Bento Grid */}
      <BentoGrid className="max-w-6xl relative z-10">
        {/* Item 1: Contextual Vector Search */}
        <BentoGridItem
          className="md:col-span-2"
          badge="Core AI Engine"
          title="Contextual Vector Resume Search"
          description="Move beyond rigid keyword matching. Our vector AI embeds candidate profiles semantically, surfacing candidates who match the exact intent of your role requirement."
          icon={<Brain className="size-5 text-sky-600" />}
          header={
            <div className="w-full space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-mono text-slate-800 font-medium">"Senior React & Node.js Lead"</span>
                </div>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">96% Match</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-slate-100 text-xs opacity-90">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-sky-500" />
                  <span className="font-mono text-slate-700">"Frontend Specialist with TypeScript"</span>
                </div>
                <span className="font-mono text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 font-bold">88% Match</span>
              </div>
            </div>
          }
        />

        {/* Item 2: Instant PDF Extraction */}
        <BentoGridItem
          className="md:col-span-1"
          badge="Automated Parsing"
          title="Instant PDF Extraction"
          description="Drag and drop candidate PDF resumes. Text extraction and embedding indexing happen instantly in the background."
          icon={<FileText className="size-5 text-sky-600" />}
          header={
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25">
                <FileText className="size-7" />
              </div>
              <span className="text-xs font-mono font-medium text-slate-500">PDF → Text → Vector Index</span>
            </div>
          }
        />

        {/* Item 3: Natural Language Queries */}
        <BentoGridItem
          className="md:col-span-1"
          badge="Natural Language"
          title="Search Like You Speak"
          description="Type queries in plain English. 'Find product designers who have worked on mobile apps in fintech'."
          icon={<Search className="size-5 text-sky-600" />}
          header={
            <div className="w-full p-3.5 rounded-xl bg-sky-50/90 border border-sky-200/80 text-xs font-mono text-sky-900 flex items-center justify-between shadow-xs">
              <span className="truncate">"Backend engineer with Go & K8s"</span>
              <Zap className="size-4 text-sky-600 fill-sky-600 shrink-0 ml-2" />
            </div>
          }
        />

        {/* Item 4: Instant Downloads & Candidate Profiles */}
        <BentoGridItem
          className="md:col-span-2"
          badge="Candidate Management"
          title="Structured Match Cards & One-Click PDF Download"
          description="Review AI-generated summaries, match scores, key skill tags, and relevant work experiences without opening every file manually."
          icon={<Download className="size-5 text-sky-600" />}
          header={
            <div className="w-full grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Alex Rivera</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">94%</span>
                </div>
                <p className="text-[10px] text-slate-500">5+ yrs lead frontend architecture</p>
                <div className="flex gap-1 pt-1">
                  <span className="text-[9px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-100 font-medium">React</span>
                  <span className="text-[9px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-100 font-medium">Next.js</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 border border-slate-100 space-y-1.5 opacity-90">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Sarah Chen</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200">89%</span>
                </div>
                <p className="text-[10px] text-slate-500">Fullstack engineer at SaaS scale</p>
                <div className="flex gap-1 pt-1">
                  <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">TypeScript</span>
                  <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">Python</span>
                </div>
              </div>
            </div>
          }
        />
      </BentoGrid>

      {/* CTA Section */}
      <div className="mt-20 max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="rounded-3xl border border-sky-200/80 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-8 md:p-12 shadow-2xl shadow-sky-600/20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 pointer-events-none" />
          <h3 className="text-2xl md:text-4xl font-extrabold text-white relative z-10">
            Ready to find your next top candidate in seconds?
          </h3>
          <p className="mt-3 text-sm md:text-base text-sky-100 max-w-xl mx-auto relative z-10">
            Search your uploaded candidate library now with natural language intelligence.
          </p>
          <div className="mt-8 flex justify-center relative z-10">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-sky-700 shadow-xl transition-all hover:scale-105 hover:bg-slate-50 active:scale-95"
            >
              <span>Launch Candidate Search</span>
              <Zap className="size-4 fill-sky-700 text-sky-700" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

