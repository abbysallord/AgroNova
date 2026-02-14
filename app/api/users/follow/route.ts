import { NextResponse } from "next/server";
import { dbSocial } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { userEmail, targetEmail } = await req.json();
        if (!userEmail || !targetEmail) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const success = await dbSocial.toggleFollow(userEmail, targetEmail);

        if (!success) {
            return NextResponse.json({ error: "Failed to toggle follow" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
    }
}
