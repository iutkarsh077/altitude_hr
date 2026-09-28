import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const currentUser = await getCurrentUser();
    const pathname = request.nextUrl.pathname;

    if (currentUser && pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!currentUser && pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!currentUser && pathname === "/chat") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/chat"],
};
