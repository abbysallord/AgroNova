import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const type = formData.get("type") as string; // 'manual' or 'image'

        if (!process.env.MISTRAL_API_KEY) {
            console.error("MISTRAL_API_KEY is missing");
            return NextResponse.json({ error: "Server configuration error: Missing API Key" }, { status: 500 });
        }

        const client = new Mistral({
            apiKey: process.env.MISTRAL_API_KEY,
        });

        let prompt = "";
        let messages: any[] = [];

        console.log(`[Soil Analysis] Request Type: ${type}`);

        let inputMetrics: any = {};

        if (type === "manual") {
            const n = formData.get("n");
            const p = formData.get("p");
            const k = formData.get("k");
            const ph = formData.get("ph");
            const moisture = formData.get("moisture");
            const location = formData.get("location");
            const color = formData.get("color");

            inputMetrics = { n, p, k, ph_level: ph, moisture };

            prompt = `Analyze the following soil data for a farmer in ${location || "India"}:
        - Nitrogen (N): ${n}
        - Phosphorus (P): ${p}
        - Potassium (K): ${k}
        - pH Level: ${ph}
        - Moisture: ${moisture}%
        - Color: ${color}

        Return a specific, helpful report for the farmer in JSON format.
        IMPORTANT: All text fields should be formatted as concise bullet points or short, punchy sentences. Do not use long paragraphs.
        
        {
            "soil_type": "Scientific name (e.g., Silty Loam)",
            "description": "Brief 2-3 sentence overview of this soil's potential.",
            "suitable_crops": ["List", "of", "5", "best", "crops"],
            "needs_water": "High | Medium | Low",
            "irrigation_advice": "Point-wise advice on watering schedule.",
            "fertilizer_recommendation": "Point-wise list of organic/chemical fertilizers.",
            "improvement_tips": "Point-wise list of actionable improvements."
        }
        Keep language simple, encouraging, and farmer-friendly.`;

            messages = [{ role: "user", content: prompt }];

        } else {
            console.error(`[Soil Analysis] Invalid type: ${type}`);
            return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 });
        }

        console.log("[Soil Analysis] Sending request to Mistral...");

        const response = await client.chat.complete({
            model: "pixtral-12b-2409",
            messages: messages,
            responseFormat: { type: "json_object" },
        });

        const content = response.choices?.[0]?.message?.content;
        if (!content) throw new Error("No content from AI");

        console.log("[Soil Analysis] Received response from Mistral");

        const cleanText = (content as string).replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResponse = JSON.parse(cleanText);

        // Inject the input metrics back into the response so the frontend can display them
        jsonResponse.ph_level = inputMetrics.ph_level;
        jsonResponse.n = inputMetrics.n;
        jsonResponse.p = inputMetrics.p;
        jsonResponse.k = inputMetrics.k;
        jsonResponse.moisture = inputMetrics.moisture;

        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        console.error("Soil Analysis Error:", error);
        // Fallback for model not found or other specific errors
        if (error.message?.includes("model")) {
            return NextResponse.json({ error: "AI Model unavailable. Please contact support." }, { status: 503 });
        }
        return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
    }
}
