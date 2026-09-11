# AI Workplace Productivity Assistant

A professional, responsive SaaS-style app with three AI tools and a dashboard. Grey-and-blue palette, no accounts or sign-in anywhere.

## Layout

- Persistent left sidebar: Dashboard, Email Generator, Meeting Summarizer, AI Assistant. Collapses to a slide-over menu on tablet/mobile with a top bar.
- Header area on each page with title, short description, and the AI disclaimer shown site-wide in the footer of the content area:
  "AI-generated content may contain errors or outdated information. Always review and verify AI outputs before using them for important workplace decisions."

## Pages

**Dashboard (home)**
- Welcome header and three quick-access cards (Email Generator, Meeting Summarizer, AI Assistant), each with icon, one-line description, and a call to action.
- A short "how it works" strip and the disclaimer.

**Email Generator**
- Inputs: recipient/context, key points, tone selector (Formal, Friendly, Persuasive), optional length.
- Generates an email into an editable text area; Copy button with confirmation, plus Regenerate and Clear.

**Meeting Summarizer**
- Paste meeting notes, generate a structured summary: Summary, Key Points, Decisions, Action Items (with owners), Deadlines.
- Result is editable and copyable, either as a whole or per section.

**AI Assistant**
- Chat transcript with streamed replies, message composer, and suggested workplace prompts on the empty state.
- Answers render as formatted text; copy button on each reply.

## Look and feel

- Grey neutral surfaces with a confident blue accent, defined as design tokens so light/dark stay consistent.
- Card-based layout, generous spacing, clear typographic hierarchy, subtle borders and shadows, lucide icons.
- Every action has loading (shimmer/spinner + disabled controls) and error states with a plain-language message and retry.

## Technical notes

- No database, no authentication, no user accounts. Nothing is persisted server-side; chat history lives in browser memory only.
- AI runs through Lovable AI (default chat model) — calls are made from small server endpoints in this same app so the API key never reaches the browser. This is required even for a "frontend-only" app; there is still no backend data store.
- Email and summarizer use one-shot structured prompts per feature; the assistant streams a chat response with full conversation history sent each turn.
- Chat UI built with AI Elements primitives (conversation, message, prompt-input, shimmer).
- Copy-to-clipboard via the clipboard API with a toast confirmation (sonner).
- Route-level SEO metadata (title/description/social tags) on each of the four pages.
