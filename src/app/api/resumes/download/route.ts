import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/prisma/db";
import { s3BucketName, s3Client } from "@/lib/s3";

export const runtime = "nodejs";

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const key = new URL(request.url).searchParams.get("key");
        if (!key || !key.startsWith("resumes/")) {
            return NextResponse.json({ error: "A valid resume key is required" }, { status: 400 });
        }

        const resume = await db.orm.uploadedPdf.where({
            key,
        }).first();


        if (!resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        const url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: s3BucketName,
                Key: key,
                ResponseContentDisposition: `attachment; filename="${resume.fileName.replace(/"/g, "")}"`,
            }),
            { expiresIn: 300 },
        );

        return NextResponse.redirect(url);
    } catch (error) {
        console.error("Resume download failed", error);
        return NextResponse.json({ error: "Unable to download resume" }, { status: 500 });
    }
}