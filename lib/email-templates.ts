export const EmailTemplate = {
    Invoice: (orderId: string, amount: number, items: any[]) => `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #16a34a;">Order Received!</h1>
            <p>Hi there,</p>
            <p>Thank you for your purchase. We have received your payment request for <strong>Order #${orderId}</strong>.</p>
            <p>Your order is currently <strong>Processing Verification</strong> by the seller.</p>
            
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Order Details</h3>
                <ul style="padding-left: 20px;">
                    ${items.map(i => `<li>${i.name} x ${i.quantity} - ₹${i.price * i.quantity}</li>`).join('')}
                </ul>
                <p><strong>Total Paid: ₹${amount.toFixed(2)}</strong></p>
            </div>

            <p>You will receive a confirmation once the seller verifies the transaction.</p>
        </div>
    `,

    SellerVerification: (orderId: string, amount: number, buyerUpiId: string, verifyLink: string) => `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #2563eb;">Action Required: Verify Payment</h1>
            <p>Hello Seller,</p>
            <p>You have a new order <strong>#${orderId}</strong> for <strong>₹${amount.toFixed(2)}</strong>.</p>
            
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <p style="margin: 0;"><strong>Buyer UPI/Ref:</strong> ${buyerUpiId}</p>
                <p style="margin: 5px 0 0;">(Please check your Bank Statement for this transaction)</p>
            </div>

            <p>To accept this order and view shipping details, you MUST verify the payment.</p>
            
            <a href="${verifyLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Payment Now</a>
            
            <p style="font-size: 12px; color: #666; margin-top: 20px;">If you did not receive this payment, click the link and report it.</p>
        </div>
    `,

    SellerSuccess: (orderId: string, address: string) => `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #16a34a;">Order Verified!</h1>
            <p>Great! You have confirmed the payment for Order <strong>#${orderId}</strong>.</p>
            
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
                <h3 style="margin-top: 0; color: #166534;">Shipping Details</h3>
                <p style="white-space: pre-wrap;">${address}</p>
            </div>

            <p>Please ship the items as soon as possible.</p>
        </div>
    `,

    BuyerFailed: (orderId: string) => `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #dc2626;">Payment Failed</h1>
            <p>We are sorry, but the seller could not verify your payment for Order <strong>#${orderId}</strong>.</p>
            <p>This order has been cancelled.</p>
            <p>If you believe this is an error, please reply to this email immediately with your payment proof (Screenshot/UTR).</p>
        </div>
    `,

    BuyerSuccess: (orderId: string, sellerName: string) => `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #16a34a;">Order Confirmed!</h1>
            <p>Hi there,</p>
            <p>Good news! <strong>${sellerName}</strong> has verified your payment for Order <strong>#${orderId}</strong>.</p>
            <p>Your items will be shipped shortly.</p>
            <p>Thank you for shopping with AgroNova.</p>
        </div>
    `,

    ResetPassword: (resetLink: string) => `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #2563eb;">Reset Your Password</h1>
            <p>Hello,</p>
            <p>We received a request to reset your password for your AgroNova account.</p>
            <p>Click the button below to reset it:</p>
            
            <a href="${resetLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">Reset Password</a>
            
            <p>If you didn't ask to reset your password, you can safely ignore this email.</p>
            <p style="font-size: 12px; color: #666;">This link will expire in 1 hour.</p>
        </div>
    `
};
