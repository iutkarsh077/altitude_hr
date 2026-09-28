"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "./ui/toast";

const PDFUploadDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const closeDialog = () => {
        setIsOpen(false);
        setSelectedFile(null);
    };

    const uploadResumeMutation = useMutation({
        mutationFn: async (file: File) => {
            const presignResponse = await fetch("/api/resumes/presigned-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    fileSize: file.size,
                }),
            });

            
            if (!presignResponse.ok) {
                throw new Error("Could not create an upload URL");
            }
            
            setIsOpen(false)
            const presignedData = (await presignResponse.json()) as {
                url?: string;
                presignedUrl?: string;
                key?: string;
                headers?: Record<string, string>;
            };
            const uploadUrl = presignedData.url ?? presignedData.presignedUrl;

            if (!uploadUrl || !presignedData.key) {
                throw new Error("The upload URL response is incomplete");
            }

            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type,
                    ...presignedData.headers,
                },
                body: file,
            });

            if (!uploadResponse.ok) {
                throw new Error("Could not upload the resume to S3");
            }

            const extractionResponse = await fetch("/api/resumes/extract-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: presignedData.key,
                    fileName: file.name,
                    contentType: file.type,
                }),
            });

            if (!extractionResponse.ok) {
                throw new Error("The resume was uploaded, but text extraction failed");
            }

            return extractionResponse.json();
        },
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
        onSuccess: () => {
            toast.add({
                title: "Resume uploaded",
                description: "Your resume is being processed.",
                timeout: 3000,
            });
            closeDialog();
        },
        onError: (error) => {
            toast.add({
                title: "Failed to upload Resume",
                description: error.message,
                timeout: 3000,
            });
        },
    });

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="rounded-full hover:cursor-pointer bg-white px-4 py-1.5 text-sm font-semibold text-sky-700 shadow-md transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                Upload Resume
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeDialog();
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="pdf-upload-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-900 shadow-2xl"
                        onKeyDown={(event) => {
                            if (event.key === "Escape") {
                                closeDialog();
                            }
                        }}
                        tabIndex={-1}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 id="pdf-upload-title" className="text-xl font-semibold">
                                    Upload your resume
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Choose a PDF resume to get started.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeDialog}
                                aria-label="Close upload dialog"
                                className="rounded-full hover:cursor-pointer p-1 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                &times;
                            </button>
                        </div>

                        <label className="mt-6 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-200 px-6 py-8 text-center transition hover:border-sky-400 hover:bg-sky-50">
                            <span className="text-sm font-medium text-slate-700">
                                {selectedFile?.name ?? "Select a PDF file"}
                            </span>
                            <span className="mt-1 text-xs text-slate-500">
                                PDF only, up to 2 MB
                            </span>
                            <input
                                type="file"
                                accept="application/pdf,.pdf"
                                className="sr-only"
                                onChange={(event) => {
                                    const file = event.target.files?.[0] ?? null;

                                    if (!file) {
                                        setSelectedFile(null);
                                        return;
                                    }

                                    if (file.type !== "application/pdf") {
                                        toast.add({
                                            title: "PDF files only",
                                            description: "Choose a resume in PDF format.",
                                            timeout: 3000,
                                        });
                                        event.target.value = "";
                                        return;
                                    }

                                    if (file.size > 2 * 1024 * 1024) {
                                        toast.add({
                                            title: "File is too large",
                                            description: "Choose a PDF smaller than 10 MB.",
                                            timeout: 3000,
                                        });
                                        event.target.value = "";
                                        return;
                                    }

                                    setSelectedFile(file);
                                }}
                            />
                        </label>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeDialog}
                                className="rounded-lg hover:cursor-pointer px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!selectedFile || uploadResumeMutation.isPending}
                                onClick={() => {
                                    if (selectedFile) {
                                        uploadResumeMutation.mutate(selectedFile);
                                    }
                                }}
                                className="rounded-lg hover:cursor-pointer bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploadResumeMutation.isPending ? "Uploading..." : "Continue"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PDFUploadDialog;