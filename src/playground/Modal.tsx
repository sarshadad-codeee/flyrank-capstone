"use client";

import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement;
    returnFocusRef.current = opener instanceof HTMLElement ? opener : null;

    const dialog = dialogRef.current;
    const backdrop = dialog?.parentElement ?? null;
    const siblings: HTMLElement[] = Array.from(document.body.children).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node !== backdrop
    );
    const previousInert = siblings.map((node) => node.inert);
    siblings.forEach((node) => {
      node.inert = true;
    });

    const first = dialog?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialog)?.focus();

    return () => {
      siblings.forEach((node, index) => {
        node.inert = previousInert[index] ?? false;
      });
      returnFocusRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const dialog = dialogRef.current;
    if (!dialog) return;
    const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === firstItem || active === dialog)) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && active === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="w-full max-w-md rounded bg-white p-6 text-black shadow-lg"
      >
        <h2 id={titleId} className="mb-3 text-xl font-semibold">
          {title}
        </h2>
        <div className="mb-4">{children}</div>
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-gray-400 px-4 py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
