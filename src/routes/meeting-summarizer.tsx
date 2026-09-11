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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Turn long meeting notes into key points, decisions, action items and deadlines you can edit and copy.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Condense messy notes into a clear, shareable meeting brief.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingSummarizer,
});

function MeetingSummarizer() {
  const summarize = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (notes.trim().length < 20) {
      setError("Paste a bit more of the meeting notes so the summary has something to work with.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await summarize({ data: { notes } });
      setSummary(result.text.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript and get a structured brief with the decisions and next steps."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meeting notes</CardTitle>
            <CardDescription>Rough bullet points and transcripts both work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Paste your notes</Label>
              <Textarea
                id="notes"
                className="min-h-72"
                placeholder="Paste the meeting notes here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={run} disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {loading ? "Summarising…" : "Summarise notes"}
              </Button>
              {summary && (
                <Button variant="outline" onClick={run} disabled={loading}>
                  <RotateCcw className="size-4" />
                  Regenerate
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => {
                  setNotes("");
                  setSummary("");
                  setError(null);
                }}
                disabled={loading}
              >
                <Trash2 className="size-4" />
                Clear
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Couldn't create the summary</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle className="text-base">Summary</CardTitle>
              <CardDescription>Fully editable before you share it.</CardDescription>
            </div>
            <CopyButton value={summary} />
          </CardHeader>
          <CardContent className="flex-1">
            {loading && !summary ? (
              <div className="space-y-3">
                <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
              </div>
            ) : (
              <Textarea
                aria-label="Meeting summary"
                className="min-h-96 font-mono text-sm"
                placeholder="Summary, key points, decisions, action items and deadlines will appear here."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
