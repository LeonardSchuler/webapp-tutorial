import type { Task } from './api/tasks';

// Minimal state management - keeps tasks in memory
class TaskStore {
  private tasks: Task[] = [];
  private listeners: Array<() => void> = [];

  getTasks(): Task[] {
    return this.tasks;
  }

  setTasks(tasks: Task[]): void {
    this.tasks = tasks;
    this.notify();
  }

  updateTask(id: number, updates: Partial<Task>): void {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...updates };
      this.notify();
    }
  }

  removeTask(id: number): number {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
      this.notify();
    }
    return index; // Return original index for potential rollback
  }

  insertTask(task: Task, index: number): void {
    this.tasks.splice(index, 0, task);
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const taskStore = new TaskStore();
