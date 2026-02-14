export interface OllamaPrediction {
  predictedPrice: number;
  confidence: number;
  rationale: string;
}

export class OllamaService {
  private baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

  async predict(
    modelName: string,
    commodityName: string,
    historicalPrices: { date: string; price: number }[]
  ): Promise<OllamaPrediction> {
    const prompt = `
      You are a commodity price analysis expert.
      Analyize the following historical prices for ${commodityName}:
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
      const response = await fetch(`${this.baseUrl}/api/generate`, {
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
      const result = JSON.parse(data.response);

      return {
        predictedPrice: Number(result.predictedPrice),
        confidence: Number(result.confidence),
        rationale: result.rationale,
      };
    } catch (error) {
      console.error('Ollama prediction failed:', error);
      throw error;
    }
  }
}
