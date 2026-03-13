import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { crops, farmSize, location } = body;

    if (!crops || crops.length === 0) {
      return NextResponse.json({ error: "No crops provided" }, { status: 400 });
    }

    if (!process.env.MISTRAL_API_KEY) {
      return NextResponse.json({ error: "MISTRAL_API_KEY not configured" }, { status: 500 });
    }

    const mistral = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });

    const prompt = `Generate a detailed Farm Report for a farmer in ${location || "India"} with ${farmSize || "2"} acres of land, growing: ${crops.join(", ")}.
    
    Return ONLY a valid JSON object with the following structure (do NOT include markdown formatting):
    {
      "performance": "General assessment of how these crops perform in this region/season. 2-3 sentences.",
      "yield_forecast": {
          "estimated_yield": "e.g. 4.5 Tons",
          "details": "Explanation based on acreage."
      },
      "financials": {
          "revenue": "e.g. ₹2,50,000",
          "expenses": "e.g. ₹80,000",
          "profit": "e.g. ₹1,70,000",
          "notes": "Brief explanation of costs and market prices."
      },
      "tips": [
          "Actionable tip 1",
          "Actionable tip 2",
          "Actionable tip 3"
      ],
      "breakthroughs": [
          {
              "title": "Title of new tech/method",
              "description": "Description of how it helps."
          },
          {
              "title": "Another breakthrough",
              "description": "Description."
          }
      ]
    }
    IMPORTANT: Provide realistic, agricultural data. Be encouraging but factual.`;

    const response = await mistral.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      responseFormat: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    try {
      const cleanText = (content as string).replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonResponse = JSON.parse(cleanText);
      return NextResponse.json(jsonResponse);
    } catch (e) {
      console.error("JSON Parse Error:", content);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Report Generation Error:", error);
    return NextResponse.json({
      error: error.message || "Internal Server Error"
    }, { status: 500 });
  }
}
