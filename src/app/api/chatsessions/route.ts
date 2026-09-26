import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/prisma/db";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const sessions = await db.orm.chatSession.where({ userId: user._id }).all();
        const serializedSessions = sessions
            .sort((first, second) => second.updatedAt.getTime() - first.updatedAt.getTime())
            .map((session) => ({
                _id: String(session._id),
                name: session.name,
                createdAt: session.createdAt.toISOString(),
                updatedAt: session.updatedAt.toISOString(),
            }));

        return NextResponse.json({ sessions: serializedSessions });
    } catch (error) {
        console.error("Chat sessions could not be loaded", error);
        return NextResponse.json({ error: "Unable to load chat sessions" }, { status: 500 });
    }
}