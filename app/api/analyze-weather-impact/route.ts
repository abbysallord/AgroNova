import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { crops, weatherData } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
    }

    // Format weather data for better AI understanding
    const daily = weatherData?.daily;
    const current = weatherData?.current;

    let weatherSummary = `Current Conditions: Temp ${current?.temperature_2m}°C, Humidity ${current?.relative_humidity_2m}%, Wind ${current?.wind_speed_10m}km/h.\n\nForecast:\n`;

    if (daily && daily.time) {
      daily.time.forEach((date: string, i: number) => {
        if (i < 7) { // 7 day forecast
          weatherSummary += `- ${date}: Max ${daily.temperature_2m_max[i]}°C, Min ${daily.temperature_2m_min[i]}°C, Rain ${daily.precipitation_sum[i]}mm, UV Index ${daily.uv_index_max?.[i]}.\n`;
        }
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
    Analyze the impact of the following weather forecast on these crops: ${crops}.
    
    WEATHER DATA:
    ${weatherSummary}

    Your goal is to provide a highly accurate and useful report for the farmer.
    1. Cite specific days or conditions from the forecast (e.g., "Heavy rain on Tuesday", "High heat on Day 3").
    2. Explain clearly WHY this weather matters for the specific crops listed.
    3. Give actionable advice.

    Return the response in this JSON format:
    {
        "impact_summary": "Detailed summary citing specific weather events and their effect.",
        "precautions": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
        "advisory": "Specific advice on irrigation and nutrients based on the rain/heat forecast.",
        "positive_outlook": "Any benefits of this weather."
    }
    Keep the tone professional yet simple for a farmer.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content from AI");

    const cleanText = (content as string).replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonResponse = JSON.parse(cleanText);

    return NextResponse.json(jsonResponse);

  } catch (error: any) {
    console.error("Weather Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
