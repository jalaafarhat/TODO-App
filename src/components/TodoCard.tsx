"use client";
import { Trash2, Pencil, Calendar } from "lucide-react"; //used lucide-react for better UI
import { Todo } from "@/src/types";

// Props interface for TodoCard component
interface TodoCardProps {
  todo: Todo;
  onDelete: (id: number) => void; // Delete handler callback
  onEdit: (todo: Todo) => void; // Edit handler callback
}

// TodoCard component, renders a single todo item
export default function TodoCard({ todo, onDelete, onEdit }: TodoCardProps) {
  return (
    <li className="p-4 bg-white border rounded shadow-md">
      {/* Todo title with completion styling */}
      <h2
        className={`font-bold ${
          todo.completed ? "line-through text-gray-500" : ""
        }`}
      >
        {todo.title}
      </h2>
      <p className="text-gray-600">{todo.description}</p>

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

      <div className="flex gap-2 mt-2 justify-end">
        <button
          onClick={() => onDelete(todo.id)}
          className="text-red-500 hover:text-red-700 flex items-center"
          title="Delete"
        >
          <Trash2 size={18} className="mr-1" />
          <span>Delete</span>
        </button>

        <button
          onClick={() => onEdit(todo)}
          className="text-blue-500 hover:text-blue-700 flex items-center"
          title="Edit"
        >
          <Pencil size={18} className="mr-1" />
          <span>Edit</span>
        </button>
      </div>
    </li>
  );
}
