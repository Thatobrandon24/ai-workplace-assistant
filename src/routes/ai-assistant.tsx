import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Bot } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI assistant about planning, communication, documents and everyday workplace tasks.",
      },
      { property: "og:title", content: "AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Ask workplace questions and get practical, structured answers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiAssistant,
});

const suggestions = [
  "Draft an agenda for a 30-minute project kickoff meeting.",
  "Help me prioritise these five tasks for the week.",
  "Rewrite this update so it is clearer for senior stakeholders.",
  "Give me a checklist for onboarding a new team member.",
];

function messageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

function AiAssistant() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport,
    onError: () =>
      setError("The assistant couldn't respond just now. Please try sending your message again."),
  });

  const busy = status === "submitted" || status === "streaming";

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setError(null);
    setInput("");
    void sendMessage({ text: value });
  };

  return (
    <>
      <PageHeader
        title="AI Workplace Assistant"
        description="A practical assistant for planning, writing and thinking through work problems."
      />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Message not sent</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden">
        <CardContent className="flex h-[32rem] flex-col gap-4 p-4 sm:p-6">
          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="gap-4">
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<Bot className="size-6 text-primary" />}
                  title="Ask your first question"
                  description="Try one of these workplace prompts to get started."
                >
                  <div className="mt-4 grid w-full max-w-xl gap-2">
                    {suggestions.map((s) => (
                      <Button
                        key={s}
                        variant="outline"
                        className="h-auto justify-start whitespace-normal px-3 py-2 text-left text-sm"
                        onClick={() => send(s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </ConversationEmptyState>
              ) : (
                messages.map((message) => {
                  const text = messageText(message);
                  return (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        <MessageResponse>{text}</MessageResponse>
                        {message.role === "assistant" && text && (
                          <div className="mt-2">
                            <CopyButton value={text} size="sm" variant="ghost" label="Copy" />
                          </div>
                        )}
                      </MessageContent>
                    </Message>
                  );
                })
              )}
              {status === "submitted" && <Shimmer>Thinking…</Shimmer>}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <PromptInput
            onSubmit={(_message, event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about meetings, emails, planning, documents…"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit
                status={status}
                disabled={!input.trim() && !busy}
                onStop={() => stop()}
              />
            </PromptInputFooter>
          </PromptInput>
        </CardContent>
      </Card>
    </>
  );
}
