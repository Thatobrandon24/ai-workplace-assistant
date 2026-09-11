import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const EmailInput = z.object({
  context: z.string().min(1),
  keyPoints: z.string().optional().default(""),
  tone: z.enum(["formal", "friendly", "persuasive"]),
  length: z.enum(["short", "medium", "detailed"]).default("medium"),
});

const SummaryInput = z.object({
  notes: z.string().min(1),
});

const toneGuide: Record<string, string> = {
  formal:
    "Formal: polished, respectful business English. No slang, no exclamation marks, complete sentences.",
  friendly:
    "Friendly: warm, approachable and conversational while still professional. Light, natural phrasing.",
  persuasive:
    "Persuasive: confident and benefit-led. Make a clear case, address likely objections and end with a strong call to action.",
};

const lengthGuide: Record<string, string> = {
  short: "Keep it under 90 words.",
  medium: "Aim for 120-180 words.",
  detailed: "Aim for 250-350 words with clear paragraphs.",
};

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const { createLovableAiGatewayProvider, getLovableApiKey, friendlyAiError, WORKPLACE_MODEL } =
      await import("./ai-gateway.server");

    try {
      const gateway = createLovableAiGatewayProvider(getLovableApiKey());
      const result = streamText({
        model: gateway(WORKPLACE_MODEL),
        system: [
          "You are an expert workplace communication assistant who writes professional emails.",
          "Rules:",
          "- Output ONLY the email, starting with a 'Subject:' line, then a blank line, then the body.",
          "- Include an appropriate greeting and sign-off with a [Your Name] placeholder.",
          "- Never invent specific facts, figures, dates or names that were not supplied; use clear placeholders like [date] instead.",
          "- No commentary, no markdown code fences.",
          `Tone — ${toneGuide[data.tone]}`,
          `Length — ${lengthGuide[data.length]}`,
        ].join("\n"),
        prompt: [
          `Purpose / recipient and context:\n${data.context}`,
          data.keyPoints?.trim() ? `Key points to cover:\n${data.keyPoints}` : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
      });

      const text = await result.text;
      return { text };
    } catch (error) {
      throw new Error(friendlyAiError(error));
    }
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummaryInput.parse(input))
  .handler(async ({ data }) => {
    const { createLovableAiGatewayProvider, getLovableApiKey, friendlyAiError, WORKPLACE_MODEL } =
      await import("./ai-gateway.server");

    try {
      const gateway = createLovableAiGatewayProvider(getLovableApiKey());
      const result = streamText({
        model: gateway(WORKPLACE_MODEL),
        system: [
          "You summarise workplace meeting notes into a clear, scannable brief.",
          "Always answer in exactly this markdown structure, keeping the headings verbatim:",
          "## Summary",
          "A short paragraph (2-4 sentences).",
          "## Key Points",
          "Bullet list of the most important discussion points.",
          "## Decisions",
          "Bullet list of decisions made. Write 'No decisions recorded.' if there are none.",
          "## Action Items",
          "Bullet list in the form '- Owner — task'. Use 'Unassigned' when no owner is named.",
          "## Deadlines",
          "Bullet list of dates or timeframes mentioned. Write 'No deadlines mentioned.' if there are none.",
          "Never invent owners, dates or outcomes that are not in the notes.",
        ].join("\n"),
        prompt: `Meeting notes:\n\n${data.notes}`,
      });

      const text = await result.text;
      return { text };
    } catch (error) {
      throw new Error(friendlyAiError(error));
    }
  });
