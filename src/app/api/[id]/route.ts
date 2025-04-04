import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "todos.json");

// Read todos from JSON file
const readTodos = () => {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]", "utf8");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

// Persist todos to storage
const writeTodos = (todos: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), "utf8");
};

// DELETE /api/[id]
// Delete todo by ID
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // Add Promise type
) {
  const { id } = await context.params; // Await the params first
  const todos = readTodos();

  // Filter using the resolved ID
  const updated = todos.filter((todo: any) => todo.id !== Number(id));
  writeTodos(updated);
  return NextResponse.json({ message: "Deleted" });
}

// PUT /api/[id]
// Update existing todo
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Update context type
) {
  const { id } = await context.params; // Await the params promise
  const { title, description, completed } = await req.json();

  const todos = readTodos();
  // Convert ID to number after awaiting
  const index = todos.findIndex((t: any) => t.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  // Update todo
  todos[index] = {
    ...todos[index],
    title,
    description,
    completed,
  };

  writeTodos(todos);

  return NextResponse.json(todos[index]);
}
