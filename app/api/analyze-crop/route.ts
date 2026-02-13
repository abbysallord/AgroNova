import { NextResponse } from "next/server";
import OpenAI from "openai";

import { checkAiRateLimit } from "@/lib/ai-rate-limit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = await checkAiRateLimit(ip);

    if (!rateLimit.success) {
      return NextResponse.json({ error: rateLimit.message }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing");
      return NextResponse.json(
        { error: "Configuration Error: OPENAI_API_KEY is missing in environment variables." },
        { status: 500 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY.trim();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64Image}`;

    const prompt = `Analyze this image. First, determine if it shows a plant, crop, leaf, or agriculture-related subject. 
    
    1. IF IT IS NOT A PLANT/CROP (e.g., a person, car, building, animal, random object):
       Return exactly this JSON: {"error": "Not a crop image"}

    2. IF IT IS A PLANT/CROP:
       Analyze for pests or diseases. Return ONLY a valid JSON object with this structure:
       {
         "disease": "Name of disease or 'Healthy'",
         "crop": "Name of crop detected",
         "confidence": "e.g. 95%",
         "severity": "Low | Moderate | High | Critical | None",
         "symptoms": ["Symptom 1", "Symptom 2"],
         "cure": {
           "chemical": ["Step 1", "Step 2"],
           "organic": ["Step 1", "Step 2"]
         },
         "prevention": ["Tip 1", "Tip 2"],
         "type": "disease | healthy"
       }

    IMPORTANT: 
    - Output strictly valid JSON. No markdown code blocks. 
    - Keep sentences short, simple, and encouraging for a farmer.`;

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    try {
      const jsonResponse = JSON.parse(content);
      return NextResponse.json(jsonResponse);
    } catch (e) {
      console.error("JSON Parse Error:", content);
      return NextResponse.json({ error: "Failed to parse AI response", details: content }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Analysis Error:", error);

    const status = error?.status || 500;
    const message = error?.message || "Internal Server Error";

    if (message.includes("401") || message.includes("Unauthorized") || status === 401) {
      return NextResponse.json({
        error: "Invalid OpenAI API Key. Please update your .env file with a valid OPENAI_API_KEY.",
        details: message
      }, { status: 401 });
    }

    return NextResponse.json({
      error: message,
      details: error.toString()
    }, { status: status });
  }
}
