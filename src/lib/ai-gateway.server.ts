import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const WORKPLACE_MODEL = "google/gemini-3.8-flash";

export function getLovableApiKey(): string {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) {
    throw new Error("AI is not configured yet. Please try again later.");
  }
  return key;
}

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export function friendlyAiError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (raw.includes("429")) {
    return "The AI service is busy right now. Please wait a moment and try again.";
  }
  if (raw.includes("402")) {
    return "AI usage limit reached. Please add credits to continue using the AI tools.";
  }
  if (raw.includes("403")) {
    return "AI access is currently blocked for this workspace.";
  }
  return "Something went wrong while generating. Please try again.";
}
