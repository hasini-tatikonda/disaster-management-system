import { getLocalFallbackResponse } from '../data/knowledgeBase';

export interface AIServiceResponse {
  reply: string;
  isFallback: boolean;
  suggestSOS?: boolean;
}

export async function askSafeGuideAI(
  prompt: string,
  disasterType?: string,
  language = 'English'
): Promise<AIServiceResponse> {
  try {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, disasterType, language })
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();

    if (data.useFallback || !data.reply) {
      const fallback = getLocalFallbackResponse(prompt, disasterType, language);
      return {
        reply: fallback.reply,
        isFallback: true,
        suggestSOS: fallback.suggestSOS
      };
    }

    const lower = prompt.toLowerCase();
    const suggestSOS =
      lower.includes('help') ||
      lower.includes('danger') ||
      lower.includes('trapped') ||
      lower.includes('emergency') ||
      lower.includes('मदद') ||
      lower.includes('సహాయం');

    return {
      reply: data.reply,
      isFallback: false,
      suggestSOS
    };
  } catch (error) {
    console.warn('AI API call failed, using local disaster knowledge base fallback:', error);
    const fallback = getLocalFallbackResponse(prompt, disasterType, language);
    return {
      reply: fallback.reply,
      isFallback: true,
      suggestSOS: fallback.suggestSOS
    };
  }
}
