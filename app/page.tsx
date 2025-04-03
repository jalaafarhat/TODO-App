"use client";
import { useEffect, useState } from "react";
import { Plus, Loader2, Calendar } from "lucide-react"; // Import Plus icon from lucide-react

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for fetching
  const [adding, setAdding] = useState(false); // Loading state for adding todo

  // Fetch Todos
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

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    const res = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        completed,
        createdAt: new Date().toISOString(), // Add this line to include the timestamp
      }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setCompleted(false);
      setIsModalOpen(false); // Close modal after submission
      fetchTodos();
    }
  };

  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-amber-50">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>

      {/* Floating Add Button , i installed the + sign from lucide-react for better UI  */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white w-16 h-16 rounded-full shadow-lg hover:bg-blue-600 transition flex items-center justify-center"
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      {/* Modal for Adding Todo */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-amber-50 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Todo</h2>
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
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Todo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Indicator for Fetching */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          <span className="ml-2">Loading Todos...</span>
        </div>
      )}

      {/* Display Todos*/}
      <ul className="mt-6 space-y-2 w-full max-w-lg">
        {todos.map((todo: any) => (
          <li key={todo.id} className="p-4 bg-white border rounded shadow-md">
            <h2
              className={`font-bold ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.title}
            </h2>
            <p className="text-gray-600">{todo.description}</p>

            {/* Add this block to display the date */}
            {todo.createdAt && (
              <div className="flex items-center text-xs text-gray-400 mt-1 mb-2">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(todo.createdAt).toLocaleString()}
              </div>
            )}

            <span
              className={`text-sm ${
                todo.completed ? "text-green-500" : "text-red-500"
              }`}
            >
              {todo.completed ? "Completed" : "Not Completed"}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
