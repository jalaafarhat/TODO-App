"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import TodoCard from "@/src/components/TodoCard";
import TodoModal from "@/src/components/TodoModal";
import { Todo } from "@/src/types";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    const res = await fetch("/api");
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

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
      await fetchTodos();
      setIsModalOpen(false);
      setEditingTodo(null);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/${id}`, { method: "DELETE" });
    await fetchTodos();
  };

  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-amber-50">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>

      <button
        onClick={() => {
          setIsModalOpen(true);
          setEditingTodo(null);
        }}
        className="fixed bottom-6 right-6 bg-blue-500 text-white w-16 h-16 rounded-full shadow-lg hover:bg-blue-600 transition flex items-center justify-center"
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingTodo || undefined}
        isSubmitting={submitting}
      />

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <span className="ml-2">Loading Todos...</span>
        </div>
      ) : (
        <ul className="mt-6 space-y-2 w-full max-w-lg">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onDelete={handleDelete}
              onEdit={(todo) => {
                setEditingTodo(todo);
                setIsModalOpen(true);
              }}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
