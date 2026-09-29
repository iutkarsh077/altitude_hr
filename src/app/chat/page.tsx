"use client";

import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowUp,
    Download,
    LoaderCircle,
    Menu,
    Sparkles,
    Briefcase,
    CheckCircle2,
    Search,
    UserCheck,
    FileText,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Sidebar from "@/components/custom/sidebar";
import { CandidateMatch, IChatSessionDetail, IUserInfo, Message } from "@/interfaces/user";
import api from "@/lib/api";
import PDFUploadDialog from "@/components/pdf-upload-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ScoreBadge({ score }: { score: number }) {
    const roundedScore = Math.round(score);
    let colorClasses = "bg-sky-50 text-sky-700 border-sky-200/80";
    if (roundedScore >= 80) {
        colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    } else if (roundedScore < 60) {
        colorClasses = "bg-amber-50 text-amber-700 border-amber-200/80";
    }

    return (
        <div className="flex flex-col items-end gap-1 shrink-0">
            <div
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold ${colorClasses}`}
            >
                <Sparkles className="size-3" />
                <span>{roundedScore}% Match</span>
            </div>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                <div
                    className={`h-full transition-all duration-500 ${roundedScore >= 80
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "bg-gradient-to-r from-sky-500 to-blue-600"
                        }`}
                    style={{ width: `${roundedScore}%` }}
                />
            </div>
        </div>
    );
}

function CandidateCard({ candidate }: { candidate: CandidateMatch }) {
    return (
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-xs transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/5">


            <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-lg text-slate-900 group-hover:text-sky-700 transition-colors">
                            {candidate.candidateName}
                        </h3>
                        <p className="mt-0.5 text-xs font-medium text-slate-500 truncate">
                            {candidate.headline}
                        </p>
                    </div>
                    <ScoreBadge score={candidate.matchScore} />
                </div>

                {/* Summary */}
                <p className="mt-3.5 text-xs leading-relaxed text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    {candidate.summary}
                </p>

                {/* Skills */}
                {candidate.skills && candidate.skills.length > 0 && (
                    <div className="mt-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Key Skills
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {candidate.skills.slice(0, 5).map((skill) => (
                                <span
                                    key={skill}
                                    className="inline-flex items-center rounded-md bg-sky-50/80 px-2 py-0.5 text-[11px] font-medium text-sky-700 border border-sky-100 hover:bg-sky-100 transition-colors"
                                >
                                    {skill}
                                </span>
                            ))}
                            {candidate.skills.length > 5 && (
                                <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                                    +{candidate.skills.length - 5} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Relevant Experience */}
                {candidate.relevantExperience && candidate.relevantExperience.length > 0 && (
                    <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Relevant Experience
                        </p>
                        {candidate.relevantExperience.slice(0, 2).map((experience, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 truncate">
                                <Briefcase className="size-3 text-sky-500 shrink-0" />
                                <span className="truncate">{experience}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 truncate max-w-[180px]">
                    <FileText className="size-3 text-slate-400 shrink-0" />
                    <span className="truncate">{candidate.fileName}</span>
                </span>

                <Link
                    href={candidate.downloadUrl}
                    title={`Download ${candidate.fileName}`}
                    aria-label={`Download ${candidate.fileName}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-sky-600 hover:shadow-md hover:shadow-sky-600/20 active:scale-95"
                >
                    <Download className="size-3.5" aria-hidden="true" />
                    <span>Download PDF</span>
                </Link>
            </div>
        </div>
    );
}

const EXAMPLE_PROMPTS = [
    "Find candidate for Senior Fullstack Engineer with Next.js & TypeScript",
    "Find candidate for Product Designer with Figma & Design Systems",
    "Find candidate for Backend Engineer with Python, FastAPI, and AWS",
    "Find candidate for Data Scientist with Machine Learning & PyTorch",
];

const ChatPage = () => {
    const [query, setQuery] = useState<IChatSessionDetail | null>(null);
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const queryClient = useQueryClient();

    const userState = useSelector((state: IUserInfo) => state);
    const userDetails = userState?.UserInfo?.user;

    const { data: sessions = [] } = useQuery({
        queryKey: ["chatSessions"],
        queryFn: async () => {
            const response = await fetch("/api/chatsessions");
            const data = (await response.json()) as {
                sessions?: IChatSessionDetail[];
                error?: string;
            };

            if (!response.ok) {
                throw new Error(data.error ?? "Unable to load chat sessions");
            }

            return data.sessions ?? [];
        },
    });

    const hasChat = messages.length > 0;

    const searchMutation = useMutation({
        mutationFn: async (promptText: string) => {
            const response = await fetch("/api/candidatematch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: promptText, query }),
            });
            const data = (await response.json()) as {
                matches?: CandidateMatch[];
                chatSessionDetail?: IChatSessionDetail;
                error?: string;
            };

            if (!response.ok) {
                throw new Error(data.error ?? "Unable to search candidates");
            }

            if (!data.chatSessionDetail) {
                throw new Error("The chat session could not be loaded");
            }

            return {
                matches: data.matches ?? [],
                chatSessionDetail: data.chatSessionDetail,
            };
        },
        onSuccess: ({ matches, chatSessionDetail }) => {
            setQuery(chatSessionDetail);
            queryClient.setQueryData<IChatSessionDetail[]>(["chatSessions"], (currentSessions = []) => [
                chatSessionDetail,
                ...currentSessions.filter((session) => session._id !== chatSessionDetail._id),
            ]);
            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: Date.now(),
                    role: "assistant",
                    content: matches.length
                        ? `I found ${matches.length} matching candidate${matches.length === 1 ? "" : "s"} for your search.`
                        : "I could not find a close match in your resume library. Try adjusting your search query or uploading more candidate resumes.",
                    candidates: matches,
                },
            ]);
        },
        onError: (error) => {
            setMessages((currentMessages) => [
                ...currentMessages,
                { id: Date.now(), role: "assistant", content: error.message },
            ]);
        },
    });

    const handleSearchSubmit = (submittedPrompt: string) => {
        const trimmedQuery = submittedPrompt.trim();
        if (!trimmedQuery || searchMutation.isPending) return;

        setMessages((currentMessages) => [
            ...currentMessages,
            { id: Date.now(), role: "user", content: trimmedQuery },
        ]);
        setPrompt("");
        searchMutation.mutate(trimmedQuery);
    };

    const submitQuery = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSearchSubmit(prompt);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    const startNewSearch = () => {
        setMessages([]);
        setQuery(null);
        setPrompt("");
        searchMutation.reset();
    };

    const { data } = useQuery({
        queryKey: [query?._id],
        queryFn: async () => {
            const res = await api.post("/getchats", {
                chatSessionId: query?._id,
            });
            return res.data;
        },
        enabled: !!query?._id,
        retry: 3
    });


    useEffect(() => {
        if (data?.chats) {
            const formattedMessages: Message[] = data.chats.map((chat: any, index: number) => ({
                id: chat._id ?? index,
                role: chat.role === "ai" ? "assistant" : chat.role,
                content:
                    chat.content ||
                    (chat.candidates?.length
                        ? `I found ${chat.candidates.length} candidate${chat.candidates.length === 1 ? "" : "s"} for your search.`
                        : ""),
                candidates: chat.candidates || [],
            }));
            setMessages(formattedMessages);
        }
    }, [data]);

    return (
        <main className="relative flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/60 via-slate-50 to-slate-100/80 text-slate-900 md:pl-64">
            <Sidebar
                sessions={sessions}
                activeSessionId={query?._id ?? null}
                onNewSearch={startNewSearch}
                onSelectSession={setQuery}
                isOpenMobile={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />

            <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 md:px-8 backdrop-blur-xl md:left-64 shadow-xs">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMobileSidebarOpen(true)}
                        aria-label="Open navigation menu"
                        className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 md:hidden"
                    >
                        <Menu className="size-5" />
                    </button>


                </div>

                <div className="flex items-center gap-3">

                    {userDetails ? (
                        <Avatar className="size-8 border border-slate-200">
                            <AvatarImage src={userDetails.image?.toString()} />
                            <AvatarFallback className="bg-sky-100 text-sky-800 text-xs font-bold">
                                {userDetails.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-all"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </header>

            <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-44 pt-20 md:px-8">
                {!hasChat ? (
                    <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">


                        <h1 className="max-w-2xl text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                            Find the candidates who{" "}
                            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                move work forward.
                            </span>
                        </h1>

                        <p className="mt-4 max-w-lg text-sm md:text-base text-slate-600 leading-relaxed">
                            Search your uploaded resume library with natural language. Surface candidates based on skills, experience, and domain expertise.
                        </p>

                        <div className="mt-10 w-full max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 text-center">
                                Try searching for
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {EXAMPLE_PROMPTS.map((promptText) => (
                                    <button
                                        key={promptText}
                                        type="button"
                                        onClick={() => handleSearchSubmit(promptText)}
                                        className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white/90 p-3 text-left text-xs font-medium text-slate-700 shadow-xs backdrop-blur-xs transition-all hover:border-sky-300 hover:bg-sky-50/50 hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            <Search className="size-3.5 text-sky-500 shrink-0" />
                                            <span className="truncate">{promptText}</span>
                                        </span>
                                        <ArrowUp className="size-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-sky-600 transition-all rotate-45" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 py-6">
                        {messages.map((message) => {
                            if (message.role === "user") {
                                return (
                                    <article
                                        key={message.id}
                                        className="ml-auto max-w-[85%] rounded-2xl rounded-tr-xs bg-gradient-to-r from-sky-600 to-blue-600 px-5 py-3.5 text-sm leading-relaxed text-white shadow-md shadow-sky-600/15"
                                    >
                                        {message.content}
                                    </article>
                                );
                            }

                            return (
                                <article
                                    key={message.id}
                                    className="flex max-w-full gap-3 text-sm leading-relaxed text-slate-700"
                                >
                                    <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 ring-2 ring-sky-100">
                                        A
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-4">
                                        {message.content && (
                                            <div className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 text-slate-800 shadow-xs backdrop-blur-xs">
                                                <p className="leading-relaxed">{message.content}</p>
                                            </div>
                                        )}

                                        {message.candidates && message.candidates.length > 0 && (
                                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                                {message.candidates.map((candidate) => (
                                                    <CandidateCard
                                                        key={candidate.documentId}
                                                        candidate={candidate}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}

                        {searchMutation.isPending && (
                            <div className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-xs text-sky-800 shadow-xs animate-pulse">
                                <LoaderCircle className="size-4 animate-spin text-sky-600 shrink-0" aria-hidden="true" />
                                <span>Analyzing candidate resumes and evaluating match criteria...</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="fixed inset-x-4 bottom-5 md:left-72 md:right-8 z-30 max-w-3xl mx-auto">
                    <form onSubmit={submitQuery}>
                        <div className="relative flex flex-col rounded-2xl border border-slate-300/80 bg-white/90 p-2.5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-all focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/10">
                            <textarea
                                value={prompt}
                                onChange={(event) => setPrompt(event.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder="Search candidates by title, skills, experience (e.g. Senior React Developer)..."
                                aria-label="Search candidates"
                                className="max-h-32 min-h-12 w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                            <div className="flex items-center justify-between border-t border-slate-100 pt-2 px-1">
                                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                                    <span>Press <kbd className="font-mono rounded border border-slate-200 bg-slate-100 px-1 py-0.5 text-[10px] text-slate-600">Enter</kbd> to search</span>
                                </span>

                                <button
                                    type="submit"
                                    title="Send candidate search"
                                    disabled={!prompt.trim() || searchMutation.isPending}
                                    className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/25 transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 shadow-none"
                                >
                                    <ArrowUp className="size-4" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default ChatPage;
