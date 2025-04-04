"use client";
import { Loader2 } from "lucide-react"; //used lucide-react for better UI
import { Todo } from "@/src/types";
import { useEffect, useState } from "react";

// Type definition for component props
interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (todo: Omit<Todo, "id" | "createdAt">) => void;
  initialValues?: Partial<Todo>;
  isSubmitting: boolean;
}

export default function TodoModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isSubmitting,
}: TodoModalProps) {
  // Form state management
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [completed, setCompleted] = useState(initialValues?.completed || false);

  // Reset form when initialValues change (for edit mode)
  useEffect(() => {
    // Reset form when modal opens/closes or initialValues change
    if (initialValues) {
      // Edit mode - populate fields
      setTitle(initialValues.title || "");
      setDescription(initialValues.description || "");
      setCompleted(initialValues.completed || false);
    } else {
      // New task mode - clear fields
      setTitle("");
      setDescription("");
      setCompleted(false);
    }
  }, [initialValues, isOpen]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, completed });
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-amber-50 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {initialValues?.id ? "Update Todo" : "Add New Todo"}
        </h2>
        {/* Todo form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <span>Completed</span>
          </label>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            {/* Submit button with loading state */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : initialValues?.id ? (
                "Update Todo"
              ) : (
                "Add Todo"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
