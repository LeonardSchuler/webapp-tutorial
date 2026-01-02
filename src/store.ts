import type { Task } from './api/tasks';

// Simple state container - keeps tasks in memory
export const taskStore = {
  tasks: [] as Task[],
  isLoaded: false,
};
