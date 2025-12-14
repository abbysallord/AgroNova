import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!process.env.MISTRAL_API_KEY) {
        console.error("MISTRAL_API_KEY is missing");
        return NextResponse.json(
            { error: "Configuration Error: MISTRAL_API_KEY is missing in environment variables. Please add it to your Vercel Project Settings." },
            { status: 500 }
        );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64Image}`;

    if (!process.env.MISTRAL_API_KEY) {
        console.error("MISTRAL_API_KEY is missing");
        return NextResponse.json(
            { error: "Configuration Error: MISTRAL_API_KEY is missing in environment variables. Please add it to your Vercel Project Settings." },
            { status: 500 }
        );
    }

    const client = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });

    const prompt = `Analyze this crop image for pests or diseases. 
    Return ONLY a valid JSON object with the following structure (do NOT include markdown formatting like \`\`\`json):
    {
      "disease": "Name of disease or 'Healthy'",
      "crop": "Name of crop",
      "confidence": "e.g. 95%",
      "severity": "Low | Moderate | High | Critical | None",
      "symptoms": "Detailed explanation of symptoms in simple, farmer-friendly language. Explain WHY this is happening.",
      "cure": {
        "chemical": "Detailed step-by-step chemical treatment instructions. Include dosage if applicable.",
        "organic": "Detailed organic or home-remedy treatment steps. Explain how to prepare and apply."
      },
      "prevention": "Comprehensive list of prevention tips for future seasons. Write as a simple paragraph.",
      "type": "disease | healthy"
    }
    If the image is not a plant/crop, return {"error": "Not a crop image"}.
    IMPORTANT: Write for a farmer. Use simple, clear, and encouraging language. Avoid overly complex jaragon. be detailed but easy to understand.`;

    const response = await client.chat.complete({
      model: "pixtral-12b-2409",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { 
                type: "image_url", 
                imageUrl: dataUrl 
            },
          ],
        },
      ],
      responseFormat: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("No content received from AI");
    }

    try {
        // Sometimes models wrap in markdown despite instructions, so we clean it just in case
        const cleanText = (content as string).replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResponse = JSON.parse(cleanText);
        return NextResponse.json(jsonResponse);
    } catch (e) {
        console.error("JSON Parse Error:", content);
        return NextResponse.json({ error: "Failed to parse AI response", details: content }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ 
        error: error.message || "Internal Server Error", 
        details: error.toString() 
    }, { status: 500 });
  }
}
