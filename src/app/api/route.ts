import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

//json file path
const filePath = path.join(process.cwd(), "data", "todos.json");

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
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const todos = readTodos();
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read todos." },
      { status: 500 }
    );
  }
}

// Handle POST request (add a new todo)
//check if all the fields are valid , if yes we add a new one and if there is error we throw exception
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
