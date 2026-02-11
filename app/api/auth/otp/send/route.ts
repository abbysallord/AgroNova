import { NextResponse } from "next/server";
import { generateOtp, createOtpHash } from "@/lib/otp";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found. Please sign up first." }, { status: 404 });
    }

    const code = generateOtp();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    const hash = createOtpHash(email, code, expiry);

    // Send the email (this is the real backend call)
    await sendVerificationEmail(email, code);

    // Return hash + expiry to client (Stateless)
    // Client stores this to verify later. Code is NOT sent.
    return NextResponse.json({ hash, expiry });
  } catch (error: any) {
    console.error("OTP Error:", error);
    return NextResponse.json({ error: "Failed to send OTP", details: error.message }, { status: 500 });
  }
}
