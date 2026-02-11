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
        { error: "Configuration Error: MISTRAL_API_KEY is missing in environment variables." },
        { status: 500 }
      );
    }
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

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "pixtral-12b-2409",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: dataUrl } }
            ]
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mistral API Error:", response.status, errorText);
      throw new Error(`Mistral API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

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
