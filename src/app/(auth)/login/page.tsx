"use client";

import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const router = useRouter();

    const handleSuccessLogin = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            console.error("Google did not return a credential");
            return;
        }

        try {
            const res = await axios.post(
                "/api/auth/google",
                { credential: credentialResponse.credential },
                { headers: { "Content-Type": "application/json" } },
            );

            router.push("/");
        } catch (error) {
            console.log(error);
        }
    }

    const handleErrorLogin = () => {
        console.log("Login Failed");
    }
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
            <div>Login with google</div>
            <GoogleLogin onSuccess={handleSuccessLogin} onError={handleErrorLogin} />
        </GoogleOAuthProvider>
    )
}

export default LoginPage