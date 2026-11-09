import type { ReactNode } from "react";
import { humanize } from "@/lib/toolView";
import type { DraftFields, ToolView } from "@/lib/toolView";

export interface ToolCardProps {
  view: ToolView;
}

const SHELL =
  "relative min-h-36 w-full max-w-md overflow-hidden rounded-2xl border p-4 ";

const URGENCY_LABELS: Record<string, string> = {
  low: "Low urgency",
  normal: "Normal urgency",
  high: "High urgency",
};

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium">
      {children}
    </span>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
    </div>
  );
}

function FieldRows({ fields }: { fields: DraftFields }) {
  return (
    <dl className="mt-3 space-y-2">
      {fields.summary && <Row label="Summary">{fields.summary}</Row>}
      {fields.category && <Row label="Category">{humanize(fields.category)}</Row>}
      {fields.urgency && <Row label="Urgency">{humanize(fields.urgency)}</Row>}
    </dl>
  );
}

/** One card, four looks. Each look answers a different question. */
export function ToolCard({ view }: ToolCardProps) {
  switch (view.kind) {
    case "drafting":
      return (
        <div
          key="drafting"
          role="status"
          data-state="drafting"
          className={SHELL + "tool-enter tool-shimmer border-border bg-card text-card-foreground"}
        >
          <p className="font-medium">Drafting your feedback summary</p>
          <p className="text-sm text-muted-foreground">Reading what you described</p>
          {view.fields.summary ? (
            <p className="mt-3 text-sm">{view.fields.summary}</p>
          ) : (
            <div className="mt-3 space-y-2" aria-hidden="true">
              <div className="h-3 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          )}
          {view.fields.category && (
            <div className="mt-3">
              <Badge>{humanize(view.fields.category)}</Badge>
            </div>
          )}
        </div>
      );
    case "working":
      return (
        <div
          key="working"
          role="status"
          data-state="working"
          className={SHELL + "tool-enter border-border bg-card text-card-foreground"}
        >
          <p className="flex items-center gap-2 font-medium">
            <span
              aria-hidden="true"
              className="inline-block size-3 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin"
            />
            Saving the draft
          </p>
          <p className="text-sm text-muted-foreground">Checking the details before showing them</p>
          <FieldRows fields={view.fields} />
        </div>
      );
    case "result":
      return (
        <div
          key="result"
          role="group"
          aria-label="Feedback summary"
          data-state="result"
          className={SHELL + "tool-enter border-border bg-card text-card-foreground"}
        >
          <p className="font-semibold">Feedback summary</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>{view.result.categoryLabel}</Badge>
            <Badge>{URGENCY_LABELS[view.result.urgency] ?? view.result.urgency}</Badge>
          </div>
          <dl className="mt-3 space-y-2">
            <Row label="Summary">{view.result.summary}</Row>
            {view.result.details && <Row label="Details">{view.result.details}</Row>}
            {view.result.desiredOutcome && (
              <Row label="Desired outcome">{view.result.desiredOutcome}</Row>
            )}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Copy this into the feedback form. The assistant cannot send it.
          </p>
        </div>
      );
    case "error":
      return (
        <div
          key="error"
          role="alert"
          data-state="error"
          className={SHELL + "tool-pop border-destructive/40 bg-card text-card-foreground"}
        >
          <span aria-hidden="true" className="tool-tint absolute inset-0 bg-destructive/10" />
          <div className="relative">
            <p className="font-semibold text-destructive">
              {view.emergency
                ? "This cannot be filed as feedback"
                : "The draft could not be created"}
            </p>
            <p className="mt-2 text-sm">{view.message}</p>
            {!view.emergency && (
              <p className="mt-2 text-sm text-muted-foreground">
                Describe the issue again, or try once more in a moment.
              </p>
            )}
          </div>
        </div>
      );
    default:
      return null;
  }
}
