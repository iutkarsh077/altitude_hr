"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 md:px-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  badge,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-xl hover:shadow-sky-500/10 transition duration-300 p-6 bg-white border border-slate-200/80 backdrop-blur-xl justify-between flex flex-col space-y-4 relative overflow-hidden hover:border-sky-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Background ambient gradient glow on hover */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-indigo-500/10 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {header && (
        <div className="w-full min-h-[160px] rounded-2xl overflow-hidden bg-slate-50/80 border border-slate-100 p-4 flex items-center justify-center relative">
          {header}
        </div>
      )}

      <div className="group-hover/bento:translate-x-1 transition duration-200 relative z-10">
        {badge && (
          <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 border border-sky-200/80 mb-2">
            {badge}
          </span>
        )}
        <div className="flex items-center gap-2 font-bold text-slate-900 text-lg tracking-tight mb-1">
          {icon}
          <span>{title}</span>
        </div>
        <div className="font-normal text-slate-600 text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};

