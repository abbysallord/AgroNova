import { NextResponse } from "next/server";
import { dbPosts } from "@/lib/db";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const { id } = params;
        const body = await req.json();
        const { userEmail, userName, text } = body;

        if (!text || !userEmail) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        const newComment = await dbPosts.addComment(id, { userEmail, userName, text });

        if (!newComment) {
            const posts = await dbPosts.getAll();
            return NextResponse.json({ error: `Comment: Post Not Found. ID: ${id}, Count: ${posts.length}` }, { status: 404 });
        }

        return NextResponse.json(newComment);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const { id } = params;
        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get('commentId');
        const userEmail = searchParams.get('userEmail');

        if (!commentId || !userEmail) return NextResponse.json({ error: "Missing params" }, { status: 400 });

        const updatedPost = await dbPosts.deleteComment(id, commentId, userEmail);

        if (!updatedPost) return NextResponse.json({ error: "Unauthorized or Not Found" }, { status: 403 });

        return NextResponse.json({ success: true, post: updatedPost });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
