import type { Metadata } from "next";
import { Disclosure } from "@/playground/Disclosure";

export const metadata: Metadata = {
  title: "Playground",
  robots: { index: false, follow: false },
};

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
    </main>
  );
}
