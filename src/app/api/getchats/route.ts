import { db } from "@/prisma/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { chatSessionId } = body;


        // console.log("sessionid in get chats are: ", chatSessionId)
        const chats = await db.orm.chats.where({ chatSessionId }).all();


        return NextResponse.json({ chats }, { status: 200 });
    } catch (error) {
        // console.log(error)
        return NextResponse.json({ error: "Unable to get chats" }, { status: 500 });
    }
}