import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in a formal, friendly or persuasive tone, then edit and copy them.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Turn a few notes into a polished, ready-to-send email.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailGenerator,
});

type Tone = "formal" | "friendly" | "persuasive";
type Length = "short" | "medium" | "detailed";

function EmailGenerator() {
  const generate = useServerFn(generateEmail);
  const [context, setContext] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [length, setLength] = useState<Length>("medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!context.trim()) {
      setError("Add some context about the email you need first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generate({ data: { context, keyPoints, tone, length } });
      setOutput(result.text.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setContext("");
    setKeyPoints("");
    setOutput("");
    setError(null);
  };

  return (
    <>
      <PageHeader
        title="Smart Email Generator"
        description="Describe the situation, pick a tone, and get a ready-to-edit email draft."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email brief</CardTitle>
            <CardDescription>The more context you give, the better the draft.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="context">Who is it for and why?</Label>
              <Textarea
                id="context"
                rows={4}
                placeholder="e.g. Email to a client explaining a two-week delay on the website launch and proposing a new date."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points (optional)</Label>
              <Textarea
                id="points"
                rows={4}
                placeholder={"e.g.\n- Apologise for the delay\n- New launch date\n- Offer a call this week"}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Select value={length} onValueChange={(v) => setLength(v as Length)}>
                  <SelectTrigger id="length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={run} disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {loading ? "Generating…" : "Generate email"}
              </Button>
              {output && (
                <Button variant="outline" onClick={run} disabled={loading}>
                  <RotateCcw className="size-4" />
                  Regenerate
                </Button>
              )}
              <Button variant="ghost" onClick={clearAll} disabled={loading}>
                <Trash2 className="size-4" />
                Clear
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Couldn't generate the email</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle className="text-base">Your draft</CardTitle>
              <CardDescription>Edit anything before you copy it.</CardDescription>
            </div>
            <CopyButton value={output} />
          </CardHeader>
          <CardContent className="flex-1">
            {loading && !output ? (
              <div className="space-y-3">
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              </div>
            ) : (
              <Textarea
                aria-label="Generated email"
                className="min-h-80 font-mono text-sm"
                placeholder="Your generated email will appear here, ready to edit."
                value={output}
                onChange={(e) => setOutput(e.target.value)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
