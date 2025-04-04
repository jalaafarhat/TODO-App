# Todo List Application with Next.js

A full-stack todo list application with CRUD operations, built with Next.js and file-based (JSON) storage.

![Screenshot (57)](https://github.com/user-attachments/assets/f09fb837-2ac5-46a1-9386-6688b67a3c26)
![Screenshot (58)](https://github.com/user-attachments/assets/9ef9dac5-0026-415b-865a-3af1091fc287)
![Screenshot (56)](https://github.com/user-attachments/assets/1d8e0319-e638-4a27-a255-320776405684)


## Features
- 📝 Create, Read, Update, and Delete todos
- 🎨 Clean UI with loading states and animations
- 📂 File-based storage (JSON)
- 📅 Created timestamps for todos
- ✅ Mark completion status
- ✏️ Edit-in-place functionality
- 🗑️ Delete confirmation
- 📱 Responsive design

  ## Start the development server
  - npm run dev
  - Open http://localhost:3000 in your browser
 
## Database Migration Guide
Current Architecture (JSON File)
Storage: data/todos.json

API Routes: Handle CRUD operations using file system methods

Pros: Simple setup, no external dependencies

Cons: Not suitable for production, limited scalability


## Migrating to a Database
Step 1: Choose a Database (MongoDB for Example)
1. Create a [free MongoDB Atlas cluster](https://www.mongodb.com/atlas/database)
2. Install required packages:
   ```bash
   npm install mongoose @types/mongoose
   
Step 2: Configure Database Connection
Create lib/db.ts

Step 3: Create Todo Model
Create models/Todo.ts

import { Schema, model } from 'mongoose';

const todoSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default model('Todo', todoSchema);

Step 4: Update API Routes

Step 5: Migrate Existing Data
Create a migration script scripts/migrate-to-mongo.ts

