import { NextResponse } from 'next/server';
import { dbOrders } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { EmailTemplate } from '@/lib/email-templates';

// We need a way to send generic email, assuming 'sendVerificationEmail' is adaptable or we create a new helper.
// For now, I will assume we can reuse the transporter logic but I might need to export the transporter or create 'sendEmail'.

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendMail(to: string, subject: string, html: string) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        });
        return true;
    } catch (e) {
        console.error("Email Error:", e);
        return false;
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orderId, cart, total, address, sellerGroups, userInputs, buyerEmail } = body;

        // In a real app, we handle multiple sellers. For MVP, we treat the 'checkout' as one order per seller, or one mixed order.
        // The user requirements imply "The Seller" receives verification. 
        // If there are multiple sellers, we should split them.
        // Let's assume we loop through sellerGroups.

        const results = [];

        // 2. Iterate Seller Groups -> Create Sub-Orders
        const createdOrders = [];
        const entries = Object.entries(sellerGroups);

        for (const [vpa, group] of entries) {
            const sellerGroup = group as any;
            // Extract Seller Email from the first item (assuming same seller per group)
            // Extract Seller Email from the first item (assuming same seller per group)
            const sellerEmail = sellerGroup.items[0]?.sellerEmail || process.env.EMAIL_USER || "admin@agronova.com";

            // Create Order in DB
            const newOrder = await dbOrders.create({
                id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                status: 'PENDING_SELLER',
                // createdAt is handled by DB
                tries: 0,
                buyerEmail: body.buyerEmail,
                sellerVpa: vpa,
                amount: sellerGroup.total,
                items: sellerGroup.items,
                buyerUpiIndex: userInputs[vpa] || "UNKNOWN",
                shippingAddress: address || "No address provided"
            });

            createdOrders.push(newOrder);

            // 3. Send Sub-Order Emails

            // A. Send Invoice to Buyer
            await transporter.sendMail({
                from: '"AgriStore" <' + process.env.EMAIL_USER + '>',
                to: body.buyerEmail, // Real Buyer
                subject: `Order Placed: ${newOrder.id}`,
                html: EmailTemplate.Invoice(newOrder.id, newOrder.amount, newOrder.items) // Assuming EmailTemplate.Invoice takes (id, amount, items)
            });

            // B. Send Verification Request to Seller
            const verifyLink = `http://localhost:3000/verify-order?orderId=${newOrder.id}`; // Generate verify link
            await transporter.sendMail({
                from: '"AgriStore System" <' + process.env.EMAIL_USER + '>',
                to: sellerEmail, // Real Seller
                subject: `Action Required: Verify Payment for ${newOrder.id}`,
                html: EmailTemplate.SellerVerification(newOrder.id, newOrder.amount, newOrder.buyerUpiIndex || "", verifyLink) // Assuming EmailTemplate.SellerVerification takes (id, amount, buyerUpiIndex, verifyLink)
            });
        }

        return NextResponse.json({ success: true, orders: createdOrders });

    } catch (e) {
        console.error("Values Error:", e);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
