"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  label: string;
  defaultTabId?: string;
}

export function Tabs({ tabs, label, defaultTabId }: TabsProps) {
  const baseId = useId();
  const [selectedId, setSelectedId] = useState<string>(
    defaultTabId ?? tabs[0]?.id ?? ""
  );
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectIndex(index: number) {
    const tab = tabs[index];
    if (!tab) return;
    setSelectedId(tab.id);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    let next: number | null = null;

    switch (event.key) {
      case "ArrowRight":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        break;
    }

    if (next !== null) {
      event.preventDefault();
      selectIndex(next);
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        className="flex border-b border-gray-300"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === selectedId;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setSelectedId(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={
                "px-4 py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 " +
                (selected
                  ? "border-b-2 border-blue-600"
                  : "border-b-2 border-transparent")
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => {
        const selected = tab.id === selectedId;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${baseId}-panel-${tab.id}`}
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            hidden={!selected}
            tabIndex={selected ? 0 : undefined}
            className="p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}
