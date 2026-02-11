import { NextResponse } from "next/server";
import { dbPosts } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { postId, userEmail } = body;

        if (!postId || !userEmail) {
            console.log("[Like API] Missing postId or userEmail:", { postId, userEmail });
            return NextResponse.json({ error: "Missing postId or userEmail" }, { status: 400 });
        }

        console.log(`[Like API] Toggling like for Post: ${postId}, User: ${userEmail}`);
        const success = await dbPosts.toggleLike(postId, userEmail);
        console.log(`[Like API] Result: ${success}`);

        if (!success) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Like API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
