"use client";

import { CloudShader } from "@/components/ui/cloud-shader";
import { IUserInfo } from "@/interfaces/user";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import PDFUploadDialog from "./pdf-upload-dialog";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "./ui/toast";
import Image from "next/image";

export default function CloudShaderHeroDemo() {
  const userDetails = useSelector((state: any) => state?.UserInfo?.user);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoadingPayment(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to initiate payment checkout");
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.add({
        title: "Checkout Error",
        description: error?.message || "Could not start checkout session.",
        timeout: 4000,
      });
      setIsLoadingPayment(false);
    }
  };

  return (
    <div className="relative min-h-200 w-full overflow-hidden">
      <CloudShader className="absolute inset-0" />

      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-sm font-bold text-sky-700 shadow-sm">
            A
          </div>
          <span className="text-lg font-semibold tracking-tight text-white drop-shadow-sm">
            Altitude
          </span>
        </div>
        <div className="flex items-center gap-3">
          {
            userDetails?.image && userDetails?.name ? (
              <Avatar>
                <AvatarImage src={userDetails.image.toString()} />
                <AvatarFallback>{userDetails.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (<Link
              href="/login"
              className="hidden text-sm font-medium text-white/90 transition hover:text-white sm:block"
            >
              Sign in
            </Link>)
          }
          <PDFUploadDialog />
        </div>
      </nav >

      {/* hero */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-12 text-center md:pt-20">
        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md md:text-6xl lg:text-7xl">
          Candidate Intelligence <br className="hidden md:block" /> above the clouds
        </h1>
        <p className="mt-6 max-w-2xl text-base text-white/90 drop-shadow-sm md:text-lg">
          Altitude gives your talent acquisition team one AI-powered platform to search, score, and rank resumes using natural language. Surface top candidates in seconds.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/chat"
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-sky-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-white/95"
          >
            Start Candidate Search
          </Link>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isLoadingPayment}
            className="rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 shadow-xl hover:-translate-y-0.5 hover:cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingPayment ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                <span>Redirecting...</span>
              </>
            ) : (
              <span>Buy a Plan</span>
            )}
          </button>
        </div>
        <p className="mt-4 text-xs text-white/70">
          Instant vector search &middot; Natural language resume parsing
        </p>
      </div>

      {/* dashboard image */}
      < div className="relative z-10 mx-auto mt-12 w-full max-w-6xl px-4 pb-4 md:mt-16 md:px-8" >
        <div className="rounded-2xl border border-white/30 bg-white/20 p-2 shadow-2xl backdrop-blur-md md:rounded-[2rem] md:p-3">
          <Image
            src="http://res.cloudinary.com/dakddv1pm/image/upload/v1790511256/posts/u9rhvfm7j3g4hrf65hrv.png"
            alt="Altitude fintech dashboard"
            className="w-full rounded-xl border border-black/5 shadow-lg md:rounded-3xl"
            priority={true}
          />
        </div>
      </div >
    </div >
  );
}
