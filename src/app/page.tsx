"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import TodoCard from "@/src/components/TodoCard";
import TodoModal from "@/src/components/TodoModal";
import { Todo } from "@/src/types";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]); // Holds list of todos
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null); // Track todo being edited
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [submitting, setSubmitting] = useState(false); // Loading state for form submission
  // Fetch todos from API
  const fetchTodos = async () => {
    setLoading(true);
    const res = await fetch("/api");
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  };
  // Initial data fetch on component mount
  useEffect(() => {
    fetchTodos();
  }, []);
  // Handle form submission on create and update
  const handleSubmit = async (todo: Omit<Todo, "id" | "createdAt">) => {
    setSubmitting(true);
    const url = editingTodo ? `/api/${editingTodo.id}` : "/api";
    const method = editingTodo ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });

    if (res.ok) {
      await fetchTodos(); // Refresh list after successful update
      setIsModalOpen(false);
      setEditingTodo(null); // Reset editing state
    }
    setSubmitting(false);
  };
  // Delete todo item by ID
  const handleDelete = async (id: number) => {
    await fetch(`/api/${id}`, { method: "DELETE" });
    await fetchTodos();
  };

  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-amber-50">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      {/* Floating action button to add new todos */}
      <button
        onClick={() => {
          setIsModalOpen(true);
          setEditingTodo(null);
        }}
        className="fixed bottom-6 right-6 bg-blue-500 text-white w-16 h-16 rounded-full shadow-lg hover:bg-blue-600 transition flex items-center justify-center"
      >
        <Plus size={32} strokeWidth={3} />
      </button>
      {/* Todo modal for create/update operations */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null); // Clear editing state on close
        }}
        onSubmit={handleSubmit}
        initialValues={editingTodo || undefined}
        isSubmitting={submitting}
      />

      {/* Loading state display */}
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <span className="ml-2">Loading Todos...</span>
        </div>
      ) : (
        /* Todo list display */
        <ul className="mt-6 space-y-2 w-full max-w-lg">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onDelete={handleDelete}
              onEdit={(todo) => {
                setEditingTodo(todo); // Set todo to edit
                setIsModalOpen(true); // Open modal
              }}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
