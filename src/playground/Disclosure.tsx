"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

export interface DisclosureProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function Disclosure({
  title,
  children,
  defaultExpanded = false,
}: DisclosureProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
  const panelId = useId();

  return (
    <div className="rounded border border-gray-300">
      <h3>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((value) => !value)}
          className="flex w-full items-center justify-between px-4 py-3 text-left font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span>{title}</span>
          <span aria-hidden="true">{expanded ? "-" : "+"}</span>
        </button>
      </h3>
      <div id={panelId} hidden={!expanded} className="px-4 pb-4">
        {children}
      </div>
    </div>
  );
}
