import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, FileText, Mail, Sparkles, Clock, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarise meeting notes and get workplace answers with AI, all from one clean dashboard.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Automate everyday workplace writing and planning tasks with AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email-generator",
    title: "Smart Email Generator",
    description:
      "Turn a few notes into a polished email in a formal, friendly or persuasive tone.",
    icon: Mail,
    cta: "Write an email",
  },
  {
    to: "/meeting-summarizer",
    title: "Meeting Notes Summarizer",
    description: "Condense long notes into key points, decisions, action items and deadlines.",
    icon: FileText,
    cta: "Summarise notes",
  },
  {
    to: "/ai-assistant",
    title: "AI Workplace Chatbot",
    description: "Ask anything about planning, communication and everyday work problems.",
    icon: Bot,
    cta: "Start chatting",
  },
] as const;

const steps = [
  { icon: Sparkles, title: "Describe the task", text: "Add your context, notes or question." },
  { icon: Clock, title: "Let AI draft it", text: "Structured prompts do the heavy lifting." },
  { icon: ClipboardCheck, title: "Review and copy", text: "Edit the output, then copy it out." },
];

function Dashboard() {
  return (
    <>
      <PageHeader
        title="Your AI workspace"
        description="Three focused tools that take the routine writing and thinking out of your working day."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.to} className="flex flex-col transition-shadow hover:shadow-md">
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle className="text-base">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild variant="secondary" className="w-full justify-between">
                  <Link to={tool.to}>
                    {tool.cta}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
          <CardDescription>Same simple flow across every tool.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {i + 1}. {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </>
  );
}
