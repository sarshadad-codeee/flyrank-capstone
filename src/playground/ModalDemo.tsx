"use client";

import { useState } from "react";
import { Modal } from "./Modal";

export function ModalDemo() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-gray-400 px-4 py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Open modal
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Example modal">
        <p>
          Focus stays inside this dialog. Press Escape to close it and return
          to the button.
        </p>
      </Modal>
    </div>
  );
}
