import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/prisma/db";

function isAuthTokenPayload(
    payload: string | jwt.JwtPayload,
): payload is jwt.JwtPayload & { userId: string } {
    return typeof payload !== "string" && typeof payload.userId === "string";
}

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();

        const token = cookieStore.get("token")?.value;

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        if (!isAuthTokenPayload(decoded)) {
            return null;
        }

        const user = await db.orm.user.where({
            _id: decoded.userId,
        }).first()

        return user;

    } catch (error) {
        return null;
    }
}