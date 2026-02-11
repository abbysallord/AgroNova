import { NextResponse } from "next/server";
import { dbPosts } from "@/lib/db";

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const { id } = params;

        // Prefer Query Param for reliability in DELETE
        const { searchParams } = new URL(req.url);
        let userEmail = searchParams.get('userEmail');

        // Fallback to body if not in query (for backward compat if needed, though we will update client)
        if (!userEmail) {
            try {
                const body = await req.json();
                userEmail = body.userEmail;
            } catch (e) { /* no body */ }
        }

        if (!userEmail) return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });

        // Debugging handled in previous steps, keeping it simple but correct now
        const success = await dbPosts.delete(id, userEmail);
        if (!success) {
            // Keep debug info if possible
            const posts = await dbPosts.getAll();
            const post = posts.find(p => p.id === id);
            if (!post) {
                return NextResponse.json({ error: `Not Found. ID: ${id}, Total Posts: ${posts.length}` }, { status: 403 });
            }
            const safeEmail = userEmail.toLowerCase().trim();
            const owner = post.userEmail.toLowerCase().trim();
            if (owner !== safeEmail) {
                return NextResponse.json({ error: `Unauthorized. Owner: ${owner}, You: ${safeEmail}` }, { status: 403 });
            }
            return NextResponse.json({ error: "Delete Failed in DB Helper" }, { status: 403 });
        }

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
        const { userEmail, content } = body;

        const updated = await dbPosts.edit(id, userEmail, content);
        if (!updated) {
            const posts = await dbPosts.getAll();
            const post = posts.find(p => p.id === id);
            if (!post) return NextResponse.json({ error: `Edit: Post Not Found (${id})` }, { status: 403 });
            return NextResponse.json({ error: `Edit Unauthorized. Owner: ${post.userEmail}, You: ${userEmail}` }, { status: 403 });
        }

        return NextResponse.json(updated);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
