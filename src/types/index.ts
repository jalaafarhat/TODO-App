//Represents a single task or item in a to-do list.
export interface Todo {
  id: number; //unique identifier
  title: string; //title of the task
  description?: string; //description of the task
  completed: boolean; //true if the task is completed
  createdAt: string; //Date when the task was created
}
