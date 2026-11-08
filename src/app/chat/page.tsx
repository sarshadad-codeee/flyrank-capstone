import type { Metadata } from "next";
import { Chat } from "@/components/Chat";

export const metadata: Metadata = {
  title: "Feedback assistant",
  robots: { index: false, follow: false },
};

export default function ChatPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Feedback assistant</h1>
      <p className="mb-4 text-muted-foreground">
        An AI assistant helps you describe your feedback. It cannot send
        anything itself, so copy its summary into the feedback form.
      </p>
      <Chat />
    </div>
  );
}
