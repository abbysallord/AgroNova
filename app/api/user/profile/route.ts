import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, ...updates } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Remove any fields that shouldn't be updated directly or are undefined
        // For simplicity, we assume the body contains valid partial user data
        // We explicitly handle crops array which might need specific handling if it's not matching schema

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                ...updates,
                // Ensure crops is handled if present (Prisma expects array for String[])
                crops: updates.crops ? updates.crops : undefined
            }
        });

        return NextResponse.json(updatedUser);
    } catch (e: any) {
        console.error("Profile Update Error:", e);
        return NextResponse.json({ error: "Failed to update profile", details: e.message }, { status: 500 });
    }
}
