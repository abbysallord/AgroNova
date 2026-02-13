import { prisma } from "@/lib/prisma";

const RATE_LIMITS = {
    MINUTE: 10,
    HOUR: 20,
    DAY: 30,
};

const FUN_MESSAGES = [
    "Whoa there, eager beaver! Even our AI tractors need a pit stop.",
    "Slow down! You're harvesting insights faster than we can grow them.",
    "Our AI scarecrow is taking a union break. Please wait a moment.",
    "You've hit the limit! Let the digital soil rest for a while.",
    "Too much fertilizer! The AI needs time to absorb your requests.",
    "Patience, farmer! Good crops take time to grow, and so do our answers.",
    "Hold your horses! You've reached your request limit for now.",
    "The AI is out to lunch. Please come back later!",
    "System cooling down... our servers are sweating!",
    "You're on fire! But our API limits are not. Give it a rest."
];

export async function checkAiRateLimit(identifier: string) {
    if (!identifier) return { success: true };

    const now = new Date();

    // Clean up identifier (e.g. handle localhost IPv6)
    const cleanIdentifier = identifier === "::1" ? "127.0.0.1" : identifier;

    try {
        const record = await prisma.rateLimit.findUnique({
            where: { identifier: cleanIdentifier },
        });

        if (!record) {
            await prisma.rateLimit.create({
                data: {
                    identifier: cleanIdentifier,
                    minuteExpiry: new Date(now.getTime() + 60 * 1000),
                    hourExpiry: new Date(now.getTime() + 60 * 60 * 1000),
                    dayExpiry: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                    minuteCount: 1,
                    hourCount: 1,
                    dayCount: 1,
                },
            });
            return { success: true };
        }

        // Check and reset counters if expiry passed
        let { minuteCount, hourCount, dayCount, minuteExpiry, hourExpiry, dayExpiry } = record;

        let updated = false;

        if (now > new Date(minuteExpiry)) {
            minuteCount = 0;
            minuteExpiry = new Date(now.getTime() + 60 * 1000);
            updated = true;
        }
        if (now > new Date(hourExpiry)) {
            hourCount = 0;
            hourExpiry = new Date(now.getTime() + 60 * 60 * 1000);
            updated = true;
        }
        if (now > new Date(dayExpiry)) {
            dayCount = 0;
            dayExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            updated = true;
        }

        // Check limits (using strict > or >= depending on if we count current request before or after)
        // I am incrementing AFTER check, so checking >= limit means "already full".

        const randomMsg = getRandomMessage();

        if (dayCount >= RATE_LIMITS.DAY) {
            return {
                success: false,
                message: `Daily limit reached (30/day). ${randomMsg}`
            };
        }
        if (hourCount >= RATE_LIMITS.HOUR) {
            return {
                success: false,
                message: `Hourly limit reached (20/hr). ${randomMsg}`
            };
        }
        if (minuteCount >= RATE_LIMITS.MINUTE) {
            return {
                success: false,
                message: `Too many requests! (10/min). ${randomMsg}`
            };
        }

        // Increment
        await prisma.rateLimit.update({
            where: { identifier: cleanIdentifier },
            data: {
                minuteCount: minuteCount + 1,
                hourCount: hourCount + 1,
                dayCount: dayCount + 1,
                minuteExpiry,
                hourExpiry,
                dayExpiry,
                lastRequest: now,
            },
        });

        return { success: true };

    } catch (error) {
        console.error("Rate Limit Error:", error);
        // Fail open
        return { success: true };
    }
}

function getRandomMessage() {
    return FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)];
}
