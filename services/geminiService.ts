import OpenAI from "openai";
import { OverallNutritionResponse } from '../types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("OpenAI API Key (process.env.OPENAI_API_KEY) is not set. Please ensure it is configured in your environment.");
  // App will load, but API calls will fail.
}

const openai = new OpenAI({ 
  apiKey: OPENAI_API_KEY || "MISSING_API_KEY", // Provide a fallback to avoid crash if API_KEY is undefined
  dangerouslyAllowBrowser: true // Allow running in browser environment
});

const PROMPT_TEMPLATE = `
System Instruction: You are an AI assistant specializing in food image analysis and nutritional estimation.
Your primary goal is to:
1.  Identify all distinct food items in the provided image.
2.  Estimate their nutritional information based on common portion sizes (visible or typical).
3.  Return YOUR ENTIRE RESPONSE EXCLUSIVELY AS A SINGLE, VALID JSON OBJECT. Do not include any explanatory text, greetings, or markdown formatting (like \`\`\`json ... \`\`\`) around the JSON object. The response must be directly parsable as JSON.

The JSON object must conform to the following TypeScript interface:
\`\`\`typescript
interface NutrientInfo {
  amount: number; // e.g., 10.5
  unit: string;   // e.g., "g" or "mg"
}

interface FoodItemNutrition {
  name: string;                 // e.g., "Apple"
  calories: number;             // e.g., 95
  protein: NutrientInfo;
  carbohydrates: NutrientInfo;
  fat: NutrientInfo;
  vitaminC?: NutrientInfo;      // Optional, e.g., { "amount": 8.4, "unit": "mg" }
  iron?: NutrientInfo;          // Optional, e.g., { "amount": 0.2, "unit": "mg" }
}

interface OverallNutritionResponse {
  summary: string; // A brief, engaging summary sentence of the identified food(s) and overall meal type if discernible. e.g., "A healthy breakfast of eggs and toast." or "Detected a banana and an apple."
  totalCalories: number;
  totalProtein: NutrientInfo;
  totalCarbohydrates: NutrientInfo;
  totalFat: NutrientInfo;
  items: FoodItemNutrition[]; // Array of identified food items with their nutrition
}
\`\`\`

Detailed JSON requirements and important instructions:
- The root of your response MUST be the \`OverallNutritionResponse\` object.
- All 'amount' fields MUST be numeric values.
- Units for protein, carbohydrates, and fat MUST be "g".
- If 'vitaminC' or 'iron' are included, their units should typically be "mg".
- Ensure all strings are properly quoted (e.g., "Apple", "g").
- Ensure all numbers are unquoted (e.g., 100, 10.5).
- Pay close attention to commas: ensure they are present between key-value pairs in objects and between elements in arrays. Do NOT use trailing commas.
- If no food items are clearly identifiable, return a valid JSON with an empty 'items' array, zero totals, and a 'summary' field like "No food items could be clearly identified in the image."
- If multiple items are present, provide an entry for each in the 'items' array and sum their values for the totals.
- Base your estimations on typical serving sizes if not clearly discernible from the image.
- The 'summary' field should be a concise, natural language sentence.

Analyze the provided image and respond ONLY with the valid JSON object described above.
`;


export const analyzeImageAndGetNutrition = async (base64ImageData: string, mimeType: string): Promise<OverallNutritionResponse> => {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API Key is not configured. Please set the OPENAI_API_KEY environment variable.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: PROMPT_TEMPLATE
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64ImageData}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2 // Lower temperature for more deterministic and structured JSON output
    });

    let jsonStr = response.choices[0]?.message?.content?.trim() ?? '';
    
    // Remove Markdown code fences if present (e.g., ```json ... ``` or ```typescript ... ```)
    const fenceRegex = /^```(?:json|typescript)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    let parsedData: OverallNutritionResponse;
    try {
      parsedData = JSON.parse(jsonStr) as OverallNutritionResponse;
    } catch (parseError: any) {
      console.error("Failed to parse JSON response from AI. Raw string was:", `"${jsonStr}"`);
      console.error("Parsing error details:", parseError.message, "at position:", parseError.at || 'N/A'); // Some parsers provide 'at'
      throw new Error("AI returned data in an unparsable JSON format. Please check the console for the raw response from the AI.");
    }

    // Basic validation of the parsed data structure
    if (typeof parsedData.totalCalories !== 'number' || !parsedData.items || !Array.isArray(parsedData.items) || typeof parsedData.summary !== 'string') {
        console.error("Parsed data is not in the expected format, even after successful parsing:", parsedData);
        throw new Error("AI returned JSON, but it does not match the expected data structure.");
    }
    
    // Further validation for nutrient objects (example for totalProtein)
    if (parsedData.totalProtein && (typeof parsedData.totalProtein.amount !== 'number' || typeof parsedData.totalProtein.unit !== 'string')) {
        console.warn("TotalProtein field in parsed data has unexpected structure:", parsedData.totalProtein);
        // Potentially throw error or try to recover depending on strictness
    }
    parsedData.items.forEach(item => {
        if (typeof item.name !== 'string' || typeof item.calories !== 'number' ||
            !item.protein || typeof item.protein.amount !== 'number' || typeof item.protein.unit !== 'string' ||
            !item.carbohydrates || typeof item.carbohydrates.amount !== 'number' || typeof item.carbohydrates.unit !== 'string' ||
            !item.fat || typeof item.fat.amount !== 'number' || typeof item.fat.unit !== 'string') {
            console.warn("An item in the 'items' array has an unexpected structure:", item);
            // Potentially throw error or filter out malformed items
        }
    });
    
    return parsedData;

  } catch (error) {
    // Catch errors from API call or from the re-thrown parsing/validation errors
    console.error("Error in analyzeImageAndGetNutrition:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key")) {
             throw new Error("Invalid OpenAI API Key. Please check your configuration.");
        }
        // Re-throw specific errors or a generic one
        throw new Error(error.message || "Failed to get nutritional analysis from AI. The AI may be unavailable or the request failed.");
    }
    throw new Error("An unknown error occurred during nutritional analysis.");
  }
};