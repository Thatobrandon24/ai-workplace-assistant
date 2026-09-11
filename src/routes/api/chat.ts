import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM_PROMPT = [
  "You are the AI Workplace Assistant: a pragmatic, professional productivity partner for office professionals.",
  "You help with drafting communication, planning work, structuring documents, preparing meetings, prioritising tasks and explaining workplace processes.",
  "Guidelines:",
  "- Be concise and actionable. Prefer short paragraphs, bullet lists and clear headings.",
  "- Ask a brief clarifying question when the request is ambiguous.",
  "- Never invent company-specific facts, names, policies or figures; use clear placeholders instead.",
  "- Stay professional and neutral; decline legal, medical or HR-disciplinary advice and suggest consulting the right specialist.",
].join("\n");

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("AI is not configured yet.", { status: 500 });
        }

        const { createLovableAiGatewayProvider, WORKPLACE_MODEL } = await import(
          "@/lib/ai-gateway.server"
        );
        const gateway = createLovableAiGatewayProvider(key);

        const result = streamText({
          model: gateway(WORKPLACE_MODEL),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
