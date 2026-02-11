import { NextResponse } from "next/server";
import { dbSocial, dbUsers } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userEmail, targetEmail } = body;

        // Auto-register users if they don't exist in DB (Critical Fix for "Follow not working")
        await dbUsers.ensure({ email: userEmail });
        await dbUsers.ensure({ email: targetEmail });

        const success = await dbSocial.toggleFollow(userEmail, targetEmail);
        if (!success) return NextResponse.json({ error: "Failed" }, { status: 400 });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
