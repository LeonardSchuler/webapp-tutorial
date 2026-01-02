import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTasks, createTask, updateTask, deleteTask } from './tasks';

// Mock fetch globally - replaces global fetch with our mock function
// This runs ONCE when the file loads and stays active for all tests
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('Task API', () => {
  beforeEach(() => {
    // Clear mock call history before each test
    // NOTE: This does NOT remove the stub - fetch is still mocked
    // It only resets: call count, arguments, and return values
    // This ensures each test starts with a clean slate
    vi.clearAllMocks();
  });

  it('should fetch tasks', async () => {
    const mockTasks = [{ id: 1, title: 'Test Task', completed: false, userId: 1 }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTasks),
    });

    const tasks = await fetchTasks();

    expect(mockFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos?_limit=10');
    expect(tasks).toEqual(mockTasks);
  });

  it('should handle fetch errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchTasks()).rejects.toThrow('HTTP error! status: 500');
  });

  it('should create a task', async () => {
    const newTask = { title: 'New Task', completed: false, userId: 1 };
    const createdTask = { id: 1, ...newTask };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createdTask),
    });

    const result = await createTask(newTask);

    expect(result).toEqual(createdTask);
  });

  it('should update a task', async () => {
    const updates = { completed: true };
    const updatedTask = { id: 1, title: 'Test', completed: true, userId: 1 };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(updatedTask),
    });

    const result = await updateTask(1, updates);

    expect(result).toEqual(updatedTask);
  });

  it('should delete a task', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    await deleteTask(1);

    expect(mockFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/1', {
      method: 'DELETE',
    });
  });
});
