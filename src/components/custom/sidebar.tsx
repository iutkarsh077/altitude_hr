"use client";

import Link from "next/link";
import { MessageSquareText, Plus, Sparkles, Home, X, ChevronRight } from "lucide-react";
import { IChatSessionDetail } from "@/interfaces/user";
import PDFUploadDialog from "../pdf-upload-dialog";

type SidebarProps = {
    sessions: IChatSessionDetail[];
    activeSessionId: string | null;
    onNewSearch: () => void;
    onSelectSession: (session: IChatSessionDetail) => void;
    isOpenMobile?: boolean;
    onCloseMobile?: () => void;
};

const Sidebar = ({
    sessions,
    activeSessionId,
    onNewSearch,
    onSelectSession,
    isOpenMobile = false,
    onCloseMobile,
}: SidebarProps) => {
    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpenMobile && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity md:hidden"
                    onClick={onCloseMobile}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sky-200/70 bg-white/85 px-4 py-5 text-slate-800 backdrop-blur-xl shadow-xl shadow-sky-900/5 transition-transform duration-300 md:w-64 md:translate-x-0 ${isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
                aria-label="Chat navigation"
            >

                <div className="flex items-center justify-between px-2">
                    <Link
                        href="/"
                        className="group flex items-center gap-3 transition-transform active:scale-95"
                    >
                        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-sky-500 text-white font-bold text-base shadow-md shadow-sky-500/20 ring-1 ring-sky-200/50 transition-shadow group-hover:shadow-sky-500/30">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-semibold tracking-tight text-slate-900 drop-shadow-xs">
                                Altitude
                            </span>

                        </div>
                    </Link>


                    {onCloseMobile && (
                        <button
                            type="button"
                            onClick={onCloseMobile}
                            aria-label="Close menu"
                            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden"
                        >
                            <X className="size-5" />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => {
                        onNewSearch();
                        if (onCloseMobile) onCloseMobile();
                    }}
                    className="mt-6 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 px-4 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition-all hover:brightness-105 hover:shadow-lg hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="size-4 stroke-[2.5]" aria-hidden="true" />
                    <span>New Candidate Search</span>
                </button>

                <div className="mt-3">
                    <div className="w-full [&>button]:w-full [&>button]:justify-center [&>button]:py-2 [&>button]:rounded-xl [&>button]:bg-white/90 [&>button]:text-slate-700 [&>button]:border [&>button]:border-slate-200/80 [&>button]:hover:bg-sky-50/80 [&>button]:hover:text-sky-700 [&>button]:hover:border-sky-300 [&>button]:shadow-xs transition-all">
                        <PDFUploadDialog />
                    </div>
                </div>


                <section className="mt-6 flex min-h-0 flex-1 flex-col" aria-label="Chat sessions">
                    <div className="flex items-center justify-between px-2 pb-2.5">
                        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Recent Searches
                        </h2>
                    </div>

                    {sessions.length ? (
                        <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-hide">
                            {sessions.map((session) => {
                                const isActive = session._id === activeSessionId;
                                return (
                                    <li key={session._id}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onSelectSession(session);
                                                if (onCloseMobile) onCloseMobile();
                                            }}
                                            title={session.name}
                                            aria-current={isActive ? "page" : undefined}
                                            className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all ${isActive
                                                ? "bg-sky-100/80 text-sky-900 font-semibold border-l-2 border-sky-600 shadow-xs"
                                                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                                                }`}
                                        >
                                            <MessageSquareText
                                                className={`size-3.5 shrink-0 transition-colors ${isActive
                                                    ? "text-sky-600"
                                                    : "text-slate-400 group-hover:text-slate-600"
                                                    }`}
                                            />
                                            <span className="truncate flex-1">{session.name}</span>
                                            {isActive && (
                                                <ChevronRight className="size-3 shrink-0 text-sky-600" />
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-4 text-center mt-2 bg-slate-50/50">
                            <MessageSquareText className="size-6 text-slate-400 mb-2" />
                            <p className="text-xs font-medium text-slate-500">No search history yet.</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Your searches will appear here.</p>
                        </div>
                    )}
                </section>

                <div className="mt-auto border-t border-slate-200/80 pt-4 px-1">
                    <Link
                        href="/"
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
                    >
                        <span className="flex items-center gap-2">
                            <Home className="size-4 text-slate-500" />
                            Back to Home
                        </span>
                        <ChevronRight className="size-3 text-slate-400" />
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

