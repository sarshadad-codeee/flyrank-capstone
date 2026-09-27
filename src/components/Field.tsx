import type { ReactNode } from "react";
import type { FormErrors } from "../types/feedback";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ id, label, hint, error, children }: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint ? (
        <p id={hintId} className="hint">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} className="error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, errors: FormErrors, key: keyof FormErrors, hasHint?: boolean) {
  const parts: string[] = [];
  if (hasHint) parts.push(`${id}-hint`);
  if (errors[key]) parts.push(`${id}-error`);
  return parts.length ? parts.join(" ") : undefined;
}
