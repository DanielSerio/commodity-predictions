import { z } from 'zod';

const predictionSchema = z.object({
  predictedPrice: z.number().positive(),
  confidence: z.number().min(1).max(100),
  rationale: z.string(),
});

export type OllamaPrediction = z.infer<typeof predictionSchema>;

export async function getOllamaStatus(): Promise<boolean> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  try {
    const response = await fetch(`${baseUrl}/`, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function predictPrice(
  modelName: string,
  commodityName: string,
  historicalPrices: { date: string; price: number; }[]
): Promise<OllamaPrediction> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const prompt = `
    You are a commodity price analysis expert.
    Analyze the following historical prices for ${commodityName}:
    ${JSON.stringify(historicalPrices)}

    Predict the price for the NEXT day.
    Respond ONLY with a JSON object in the following format:
    {
      "predictedPrice": number,
      "confidence": number (1-100),
      "rationale": "string"
    }
  `;

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawResult = JSON.parse(data.response);

    // Validate with Zod
    return predictionSchema.parse(rawResult);
  } catch (error) {
    console.error('Ollama prediction failed:', error);
    throw error;
  }
}
