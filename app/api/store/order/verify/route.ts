import { NextResponse } from 'next/server';
import { dbOrders, dbUsers } from '@/lib/db';
import nodemailer from 'nodemailer';
import { EmailTemplate } from '@/lib/email-templates';

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
        const { orderId, action } = body;

        const order = await dbOrders.getById(orderId);
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        if (action === 'VERIFY') {
            // Validate Seller Identity
            // 1. Check if email provided matches the seller of the items
            const orderSellerEmail = order.items[0]?.sellerEmail || process.env.EMAIL_USER || "admin@agronova.com";

            // Case-insensitive check
            if (body.sellerEmail.trim().toLowerCase() !== orderSellerEmail.trim().toLowerCase()) {
                return NextResponse.json({ success: false, error: "Email does not match the seller record." }, { status: 403 });
            }

            // 2. Prevent Self-Verification (Buyer != Seller)
            if (body.sellerEmail.trim().toLowerCase() === order.buyerEmail.trim().toLowerCase()) {
                return NextResponse.json({ success: false, error: "Buyer cannot verify their own order." }, { status: 403 });
            }

            // 3. Verify Buyer UPI ID (Transaction Proof)
            // Seller must know who paid them.
            const storedUpi = (order.buyerUpiIndex || "").trim().toLowerCase();
            const inputUpi = (body.buyerUpiInput || "").trim().toLowerCase();

            if (inputUpi !== storedUpi) {
                // Formatting mismatch or wrong ID
                const newTries = (order.tries || 0) + 1;

                if (newTries >= 5) {
                    // Too many wrong attempts => Cancel Order (Security Risk or Fraud)
                    await dbOrders.update(orderId, { status: 'FAILED', tries: newTries });

                    // Strike against Buyer? Or just notify? 
                    // User said: "order will be cancelled and buyer will be informed".
                    await sendMail(
                        order.buyerEmail,
                        `Order Cancelled #${orderId}`,
                        EmailTemplate.BuyerFailed(orderId)
                    );

                    return NextResponse.json({ success: true, status: 'FAILED', message: "Order Cancelled due to repeated verification failures." });
                } else {
                    // Soft Fail
                    await dbOrders.update(orderId, { tries: newTries });
                    return NextResponse.json({
                        success: true,
                        status: 'PENDING_SELLER',
                        remaining: 5 - newTries
                    });
                }
            }

            // If Match -> Success
            await dbOrders.update(orderId, { status: 'VERIFIED' });

            // Send Success Email to Seller with Shipping Details
            await transporter.sendMail({
                from: '"AgriStore" <' + process.env.EMAIL_USER + '>',
                to: body.sellerEmail,
                subject: `Payment Verified: Order ${order.id}`,
                html: EmailTemplate.SellerSuccess(order.id, order.shippingAddress)
            });

            return NextResponse.json({ success: true, status: 'VERIFIED' });
        }
        else if (action === 'REJECT') {
            // Failure Logic
            const newTries = (order.tries || 0) + 1;

            if (newTries >= 5) {
                // Permanently Fail
                await dbOrders.update(orderId, { status: 'FAILED', tries: newTries });

                // Strike Logic
                await dbUsers.addStrike(order.buyerEmail, "Payment Verification Failed 5x", orderId);

                // Notify Buyer
                await sendMail(
                    order.buyerEmail,
                    `Order Cancelled #${orderId}`,
                    EmailTemplate.BuyerFailed(orderId)
                );

                return NextResponse.json({ success: true, status: 'FAILED' });
            } else {
                // Just increment
                await dbOrders.update(orderId, { tries: newTries });
                return NextResponse.json({ success: true, status: 'PENDING_SELLER', tries: newTries, message: `Retry recorded. ${5 - newTries} attempts remaining.` });
            }
        }

        return NextResponse.json({ error: "Invalid Action" }, { status: 400 });

    } catch (e) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
