import { NextResponse } from "next/server";
import { dbPosts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const posts = await dbPosts.getAll();
        return NextResponse.json(posts);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userEmail, userName, userRole, content, image } = body;

        if (!userEmail || !content) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newPost = await dbPosts.create({
            userEmail,
            userName,
            userRole,
            content,
            image
        });

        return NextResponse.json(newPost);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const userEmail = searchParams.get("userEmail");

        console.log(`[API] DELETE Post Request: id=${id}, userEmail=${userEmail}`);

        if (!id || !userEmail) {
            console.log("[API] Missing id or userEmail");
            return NextResponse.json({ error: "Missing id or userEmail" }, { status: 400 });
        }

        const success = await dbPosts.delete(id, userEmail);
        console.log(`[API] Delete result: ${success}`);

        if (!success) return NextResponse.json({ error: "Unauthorized or Not Found" }, { status: 403 });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error(`[API] Delete Error: ${e.message}`);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { postId, content, userEmail } = body;

        console.log(`[API] PUT Post Request: id=${postId}, userEmail=${userEmail}`);

        if (!postId || !content || !userEmail) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const result = await dbPosts.edit(postId, userEmail, content);
        if (!result) return NextResponse.json({ error: "Unauthorized or Not Found" }, { status: 403 });

        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
