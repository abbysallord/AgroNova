import { NextResponse } from "next/server";
import { dbUsers } from "@/lib/db";

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

        // Ensure mocks exist in DB so they can be followed
        for (const mock of mockUsers) {
            await dbUsers.ensure(mock);
        }

        // Re-read to get latest with IDs/Strikes etc if relevant
        users = await dbUsers.getAll();

        // Combine real + mock (deduplicate by email if needed, but mock emails are fake)
        // Since we ensured them, they ARE in `users` now! 
        // So we just return `users`.
        // But `users` might contain non-mock users too. That's fine.

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
