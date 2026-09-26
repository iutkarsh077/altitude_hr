"use client";

import { useState } from "react";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { CloudShader } from "@/components/ui/cloud-shader";

const LoginPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSuccessLogin = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            toast.add({
                title: "Authentication Error",
                description: "Google did not return a valid login credential.",
                timeout: 3000,
            });
            return;
        }

        try {
            setIsLoading(true);
            await axios.post(
                "/api/auth/google",
                { credential: credentialResponse.credential },
                { headers: { "Content-Type": "application/json" } },
            );

            toast.add({
                title: "Welcome back!",
                description: "Successfully signed in to Altitude.",
                timeout: 3000,
            });

            router.push("/");
        } catch (error: any) {
            console.error("Login request failed:", error);
            toast.add({
                title: "Sign in Failed",
                description: error?.response?.data?.error || "Unable to complete Google sign in.",
                timeout: 4000,
            });
            setIsLoading(false);
        }
    };

    const handleErrorLogin = () => {
        toast.add({
            title: "Sign in Failed",
            description: "Google authentication was cancelled or failed.",
            timeout: 3000,
        });
    };

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
            <CloudShader className="absolute inset-0" />


            <nav className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95"
                >
                    <div className="flex size-8 items-center justify-center rounded-xl bg-white/90 text-sm font-bold text-sky-700 shadow-md backdrop-blur-md">
                        A
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
                        Altitude
                    </span>
                </Link>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                    <ArrowLeft className="size-3.5" />
                    <span>Back to Home</span>
                </Link>
            </nav>

            <div className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-white/30 bg-white/20 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center">
                <div className="flex flex-col items-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-white/95 text-sky-700 font-extrabold text-2xl shadow-xl backdrop-blur-md ring-4 ring-white/30 mb-5">
                        A
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                        Welcome to Altitude
                    </h1>
                    <p className="mt-2 text-sm text-white/90 drop-shadow-xs max-w-xs leading-relaxed">
                        Sign in to access your candidate intelligence library and AI matching engine.
                    </p>
                </div>

                <div className="mt-8 flex flex-col items-center justify-center">
                    {isLoading ? (
                        <div className="flex w-full items-center justify-center gap-3 rounded-full border border-white/30 bg-white/20 py-3 text-xs font-semibold text-white backdrop-blur-md animate-pulse">
                            <LoaderCircle className="size-4 animate-spin text-white" />
                            <span>Signing in...</span>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:mx-auto shadow-lg rounded-full overflow-hidden">
                            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
                                <GoogleLogin
                                    onSuccess={handleSuccessLogin}
                                    onError={handleErrorLogin}
                                    theme="outline"
                                    size="large"
                                    shape="pill"
                                    text="continue_with"
                                    width="100%"
                                />
                            </GoogleOAuthProvider>
                        </div>
                    )}
                </div>

                <p className="mt-8 text-xs text-white/70 drop-shadow-xs leading-relaxed">
                    By signing in, you agree to our{" "}
                    <Link href="#" className="underline text-white hover:text-white/90">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="underline text-white hover:text-white/90">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </main>
    );
};

export default LoginPage;

