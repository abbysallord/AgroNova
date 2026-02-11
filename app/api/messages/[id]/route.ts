import { NextResponse } from "next/server";
import { dbSocial } from "@/lib/db";

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const { id } = params;
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get('userEmail');

        if (!userEmail) return NextResponse.json({ error: "Missing user" }, { status: 400 });

        const success = await dbSocial.deleteMessage(id, userEmail);
        if (!success) return NextResponse.json({ error: "Unauthorized or Not Found" }, { status: 403 });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const { id } = params;
        const body = await req.json();
        const { userEmail, content, reaction } = body;

        let result;
        if (reaction) {
            result = await dbSocial.reactMessage(id, userEmail, reaction);
        } else if (content) {
            result = await dbSocial.editMessage(id, userEmail, content);
        } else {
            return NextResponse.json({ error: "No action specified" }, { status: 400 });
        }

        if (!result) return NextResponse.json({ error: "Unauthorized or Not Found" }, { status: 403 });

        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
