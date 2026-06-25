import fs from "fs";
import path from "path";

export interface GeminiImage {
  mimeType: string;
  data: string; // base64 encoded
}

interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export async function callGemini(
  prompt: string,
  images?: GeminiImage[],
  jsonSchema?: object,
  onRetry?: (message: string) => void
): Promise<unknown> {
  let apiKey = process.env.GEMINI_API_KEY;

  // Fallback: search in workspace .env / .env.local file
  if (!apiKey) {
    const paths = [
      path.join(process.cwd(), ".env.local"),
      path.join(process.cwd(), ".env")
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf-8");
        const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
        if (match && match[1]) {
          apiKey = match[1].trim();
          break;
        }
      }
    }
  }

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not set. Please create a .env.local file with your GEMINI_API_KEY."
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const parts: GeminiPart[] = [{ text: prompt }];

  if (images && images.length > 0) {
    for (const img of images) {
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data
        }
      });
    }
  }

  const generationConfig: Record<string, unknown> = {
    responseMimeType: "application/json"
  };

  if (jsonSchema) {
    generationConfig.responseSchema = jsonSchema;
  }

  const requestBody = {
    contents: [
      {
        parts
      }
    ],
    generationConfig
  };

  const maxRetries = 3;
  let attempt = 0;
  let currentDelay = 2000; // Start with 2 seconds

  while (true) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 429) {
        attempt++;
        if (attempt > maxRetries) {
          throw new Error("Rate limit exceeded. Maximum retries reached.");
        }
        const delaySecs = (currentDelay / 1000).toFixed(1);
        if (onRetry) {
          onRetry(`Gemini API Rate Limit (HTTP 429) encountered. Retrying in ${delaySecs}s (attempt ${attempt}/${maxRetries})...`);
        }
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= 2.5; // Exponential delay scaling
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("No response text returned from Gemini API");
      }

      try {
        return JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse Gemini JSON output:", text, err);
        throw new Error("Gemini response is not valid JSON: " + text.substring(0, 100));
      }
    } catch (error) {
      if (attempt < maxRetries && (String(error).includes("429") || responseIsRateLimited(error))) {
        attempt++;
        const delaySecs = (currentDelay / 1000).toFixed(1);
        if (onRetry) {
          onRetry(`Gemini API call failed with rate limit error. Retrying in ${delaySecs}s...`);
        }
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= 2.5;
        continue;
      }
      throw error;
    }
  }
}

function responseIsRateLimited(error: unknown): boolean {
  const errMsg = String(error).toLowerCase();
  return errMsg.includes("rate") || errMsg.includes("429") || errMsg.includes("quota");
}
