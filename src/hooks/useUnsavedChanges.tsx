import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useUnsavedChanges(isDirty: boolean) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);

  const preventNavigation = useCallback(
    (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    },
    [isDirty]
  );

  useEffect(() => {
    if (isDirty) {
      window.addEventListener("beforeunload", preventNavigation);
    }

    return () => {
      window.removeEventListener("beforeunload", preventNavigation);
    };
  }, [isDirty, preventNavigation]);

  const blockNavigation = useCallback(
    (url: string) => {
      if (isDirty) {
        setIsNavigating(true);
        setNextRoute(url);
        return false;
      }
      return true;
    },
    [isDirty]
  );

  const confirmNavigation = useCallback(
    (shouldNavigate: boolean) => {
      setIsNavigating(false);
      if (shouldNavigate && nextRoute) {
        router.push(nextRoute);
      }
      setNextRoute(null);
    },
    [router, nextRoute]
  );

  return {
    isNavigating,
    confirmNavigation,
    blockNavigation,
    nextRoute,
  };
}

export function UnsavedChangesDialog({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Unsaved Changes</h2>
        <p className="mb-6">
          You have unsaved changes. Are you sure you want to leave?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Leave Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
