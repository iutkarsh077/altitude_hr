import { db } from "@/prisma/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { chatSessionId } = body;

        const chats = await db.orm.chats.where({ chatSessionId }).all();

        console.log("all chats are: ", chats)

        return NextResponse.json({ chats }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Unable to get chats" }, { status: 500 });
    }
}