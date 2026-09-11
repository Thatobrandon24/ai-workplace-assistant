import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export const DISCLAIMER_TEXT =
  "AI-generated content may contain errors or outdated information. Always review and verify AI outputs before using them for important workplace decisions.";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border bg-muted/60 p-4 text-sm text-muted-foreground",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <p>{DISCLAIMER_TEXT}</p>
    </div>
  );
}
