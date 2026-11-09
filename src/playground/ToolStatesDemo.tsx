import { ToolCard } from "@/components/ToolCard";
import type { ToolView } from "@/lib/toolView";

interface Sample {
  id: string;
  question: string;
  title: string;
  view: ToolView;
}

const SAMPLES: Sample[] = [
  {
    id: "drafting",
    title: "Input streaming",
    question: "What is it doing?",
    view: { kind: "drafting", fields: { category: "high_billing" } },
  },
  {
    id: "working",
    title: "Input available",
    question: "With what input?",
    view: {
      kind: "working",
      fields: {
        category: "high_billing",
        urgency: "normal",
        summary: "My gas bill was double last month.",
      },
    },
  },
  {
    id: "result",
    title: "Output available",
    question: "What came back?",
    view: {
      kind: "result",
      result: {
        category: "high_billing",
        categoryLabel: "High billing",
        urgency: "normal",
        summary: "My gas bill was double last month and I want the meter checked.",
        details: "The bill arrived on 3 November.",
        desiredOutcome: "Check my meter.",
      },
    },
  },
  {
    id: "error-emergency",
    title: "Output error: emergency",
    question: "What went wrong?",
    view: {
      kind: "error",
      emergency: true,
      message:
        "This sounds like an emergency, so it cannot be filed as feedback. Leave the area, avoid switches and flames, and call the emergency line or local emergency services.",
    },
  },
  {
    id: "error-other",
    title: "Output error: other failure",
    question: "What went wrong?",
    view: {
      kind: "error",
      emergency: false,
      message: "The draft could not be created.",
    },
  },
];

/**
 * Shows every tool card state side by side from fixed sample data, with
 * no model call. In the real chat the first two states last only a
 * moment, and the error state needs a failed tool run, so this page
 * is the easy way to see them all.
 */
export function ToolStatesDemo() {
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        These cards use fixed sample data, not model output. In the chat the
        model decides when to run the tool, and it gives safety advice instead
        of filing an emergency report.
      </p>
      <div className="space-y-6">
        {SAMPLES.map((sample) => (
          <div key={sample.id} data-sample={sample.id}>
            <h3 className="mb-2 text-base font-medium">
              {sample.title}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {sample.question}
              </span>
            </h3>
            <ToolCard view={sample.view} />
          </div>
        ))}
      </div>
    </div>
  );
}
