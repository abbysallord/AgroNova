import { NextResponse } from "next/server";
import { dbSocial } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    try {
        const msgs = await dbSocial.getMessages(email);
        return NextResponse.json(msgs);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sender, receiver, content } = body;

        const msg = await dbSocial.sendMessage(sender, receiver, content);
        return NextResponse.json(msg);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
