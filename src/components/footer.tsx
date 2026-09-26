"use client";

import Link from "next/link";
import { Sparkles, ArrowUpRight, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/80 text-slate-600 font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-sky-500 text-white font-bold text-base shadow-md shadow-sky-500/20">
                A
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Altitude
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              AI-powered candidate search and vector resume matching for modern recruiters and talent acquisition teams. Close roles faster with semantic precision.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Product
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/chat" className="hover:text-sky-600 transition-colors flex items-center gap-1">
                  Candidate Search
                  <ArrowUpRight className="size-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-sky-600 transition-colors">
                  Vector Matching API
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-sky-600 transition-colors">
                  PDF Resume Parser
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-sky-600 transition-colors">
                  Match Score Radar
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Solutions
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/chat" className="hover:text-sky-600 transition-colors">
                  Engineering Hiring
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-sky-600 transition-colors">
                  Product &amp; Design Talent
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-sky-600 transition-colors">
                  Executive Search
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-sky-600 transition-colors">
                  High-Volume Screening
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="https://utkarsh-human.vercel.app/" target="_blank" className="hover:text-sky-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="https://utkarsh-human.vercel.app/" target="_blank" className="hover:text-sky-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="https://utkarsh-human.vercel.app/" target="_blank" className="hover:text-sky-600 transition-colors">
                  Security &amp; Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Altitude AI, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
