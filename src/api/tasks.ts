export interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const API_BASE = 'https://jsonplaceholder.typicode.com';

export async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_BASE}/todos?_limit=10`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tasks = (await response.json()) as Task[];
    return tasks;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  const response = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  return (await response.json()) as Task;
}

export async function updateTask(id: number, updates: Partial<Task>): Promise<Task> {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  return (await response.json()) as Task;
}

export async function deleteTask(id: number): Promise<void> {
  await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE',
  });
}
