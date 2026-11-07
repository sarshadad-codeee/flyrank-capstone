import type { Metadata } from "next";
import { Disclosure } from "@/playground/Disclosure";
import { Tabs } from "@/playground/Tabs";
import type { TabItem } from "@/playground/Tabs";

export const metadata: Metadata = {
  title: "Playground",
  robots: { index: false, follow: false },
};

const tabItems: TabItem[] = [
  {
    id: "keys",
    label: "Keys",
    content: (
      <p>
        Left and Right arrows move between tabs and wrap around. Home and End
        jump to the first and last tab.
      </p>
    ),
  },
  {
    id: "focus",
    label: "Focus",
    content: (
      <p>
        Only the selected tab is in the Tab order. Press Tab to move into this
        panel.
      </p>
    ),
  },
  {
    id: "roles",
    label: "Roles",
    content: (
      <p>
        The tab list, tabs and panels use the tablist, tab and tabpanel roles.
      </p>
    ),
  },
];

export default function PlaygroundPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Accessible components playground
      </h1>
      <section aria-labelledby="disclosure-heading" className="mb-10">
        <h2 id="disclosure-heading" className="mb-3 text-xl font-medium">
          Disclosure
        </h2>
        <Disclosure title="What is a disclosure?">
          <p>
            A button that shows or hides a section of content. Try it with Tab,
            Enter and Space.
          </p>
        </Disclosure>
      </section>
      <section aria-labelledby="tabs-heading" className="mb-10">
        <h2 id="tabs-heading" className="mb-3 text-xl font-medium">
          Tabs
        </h2>
        <Tabs tabs={tabItems} label="Keyboard notes" />
      </section>
    </main>
  );
}
