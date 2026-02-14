import { NextResponse } from "next/server";
import { dbUsers } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        let users = await dbUsers.getAll();

        // Mock Users for interactions
        const mockUsers = [
            { name: "Ramesh Kumar", email: "ramesh@farm.com", role: "Expert Farmer", status: "CLEAR", followers: ["alice@example.com"], following: [] },
            { name: "Suresh Patel", email: "suresh@agri.com", role: "Agronomist", status: "CLEAR", followers: [], following: [] },
            { name: "Anita Devi", email: "anita@dairy.com", role: "Dairy Expert", status: "CLEAR", followers: [], following: [] },
            { name: "Vikram Singh", email: "vikram@seeds.com", role: "Seed Supplier", status: "CLEAR", followers: [], following: [] },
        ] as any[];

        // Optimization: Only ensure mocks if they are missing from the fetched list
        // and do it in parallel
        const existingEmails = new Set(users.map((u: any) => u.email));
        const missingMocks = mockUsers.filter(mock => !existingEmails.has(mock.email));

        if (missingMocks.length > 0) {
            await Promise.all(missingMocks.map(mock => dbUsers.ensure(mock)));
            // Add them to the current list locally to avoid re-fetching
            users = [...users, ...missingMocks.map(m => ({ ...m, id: "temp-id", strikes: [] }))];
            // Ideally we'd re-fetch to get IDs but for display list it's fine, or we can just push them
        }

        // Return only public info
        const safeUsers = users.map((u: any) => ({
            name: u.name || u.email.split('@')[0],
            email: u.email,
            role: u.role || "Farmer",
            status: u.status,
            followers: u.followers || [],
            following: u.following || []
        }));
        return NextResponse.json(safeUsers);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
