import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Correct file path (root directory)
const filePath = path.join(process.cwd(), "todos.json");

// Function to read todos.json
const readTodos = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8"); // Create an empty array if file doesn't exist
  }
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading todos:", error);
    return [];
  }
};

// Function to write to todos.json
const writeTodos = (todos: any[]) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing todo:", error);
  }
};

// Handle GET request (fetch all todos)
export async function GET() {
  const todos = readTodos();
  return NextResponse.json(todos);
}

// Handle POST request (add a new todo)
export async function POST(req: Request) {
  try {
    const { title, description, completed, createdAt } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Required field!" }, { status: 400 });
    }

    const todos = readTodos();
    const newTodo = {
      id: Date.now(),
      title,
      description: description || "",
      completed: completed ?? false,
      createdAt: createdAt || new Date().toISOString(),
    };

    todos.push(newTodo);
    writeTodos(todos);

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
