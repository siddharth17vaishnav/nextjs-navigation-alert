"use client";
import {
  UnsavedChangesDialog,
  useUnsavedChanges,
} from "@/hooks/useUnsavedChanges";
import { useState } from "react";

export default function Home() {
  const [isDirty] = useState(true);

  const { isNavigating, confirmNavigation, blockNavigation } =
    useUnsavedChanges(isDirty);

  const handleNavigation = (url: string) => {
    if (blockNavigation(url)) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div
        style={{
          width: 200,
          height: 200,
          background: "blue",
          cursor: "pointer",
        }}
        onClick={() => handleNavigation("/1")}
      >
        1
      </div>
      <UnsavedChangesDialog
        isOpen={isNavigating}
        onConfirm={() => confirmNavigation(true)}
        onCancel={() => confirmNavigation(false)}
      />
    </>
  );
}
