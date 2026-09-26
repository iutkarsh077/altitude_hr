import { OAuth2Client, TokenPayload } from "google-auth-library";
import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { credential } = body;

        if (!credential) {
            return NextResponse.json({ error: "Missing credential", status: false }, { status: 400 });
        }

        if (!client) {
            throw new Error("GOOGLE_CLIENT_ID is not configured");
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload();

        if (!payload) {
            return NextResponse.json({ error: "Invalid credential", status: false }, { status: 400 });
        }

        const {
            sub: googleId,
            email,
            name,
            picture,
            email_verified,
        } = payload;

        if (!googleId || !email) {
            return NextResponse.json({ error: "Invalid email", status: false }, { status: 400 });
        }

        let userData = await db.orm.user.where({ googleId }).first();

        if (!userData) {
            userData = await db.orm.user.create({
                googleId,
                email,
                name: name ?? null,
                image: picture ?? null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        const token = jwt.sign(
            {
                userId: userData._id,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "7d",
            }
        );

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: userData._id,
                name: userData.name,
                email: userData.email,
                image: userData.image,
            },
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error", status: false }, { status: 500 });
    }
}