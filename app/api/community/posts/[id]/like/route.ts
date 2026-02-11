import { NextResponse } from "next/server";
import { dbPosts } from "@/lib/db";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const { id } = params;
        const body = await req.json();
        const { userEmail } = body;

        if (!userEmail) return NextResponse.json({ error: "Missing user" }, { status: 400 });

        const updatedPost = await dbPosts.toggleLike(id, userEmail);

        if (!updatedPost) return NextResponse.json({ error: "Post not found" }, { status: 404 });

        return NextResponse.json(updatedPost);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
