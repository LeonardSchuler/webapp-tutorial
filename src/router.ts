import Navigo from 'navigo';
import { fetchTasks, updateTask, deleteTask, type Task } from './api/tasks';
import { taskStore } from './store';

// Initialize router with base path '/' (root of your domain)
// This tells Navigo where your app is mounted (useful for subdirectory deployments)
export const router = new Navigo('/');

// Define routes - mapping URL patterns to render functions
export function setupRouter(appElement: HTMLElement) {
  router
    // Route: Home page (/)
    .on('/', () => {
      renderHome(appElement);
    })
    // Route: Tasks page (/tasks)
    .on('/tasks', () => {
      renderTasks(appElement);
    })
    // Route: About page (/about)
    .on('/about', () => {
      renderAbout(appElement);
    })
    // Fallback route: Catch all unmatched URLs
    .notFound(() => {
      appElement.innerHTML =
        '<div class="container mx-auto p-8"><h1 class="text-4xl">404 - Page Not Found</h1></div>';
    })
    // Start routing - check current URL and call matching handler
    .resolve();
}

// Render function: Updates the DOM for the home page
function renderHome(appElement: HTMLElement) {
  // Replace the entire content of appElement with new HTML
  appElement.innerHTML = `
    <div class="container mx-auto max-w-4xl px-4 py-8">
      <div class="card">
        <h2 class="text-3xl font-bold mb-4 text-gray-800">Welcome to Task Manager</h2>
        <p class="text-gray-600 mb-4">A modern PWA built with:</p>
        <ul class="list-disc list-inside text-gray-600 space-y-2">
          <li>Vite + TypeScript</li>
          <li>Web Components</li>
          <li>Navigo Routing</li>
          <li>Tailwind CSS</li>
          <li>Fetch API</li>
        </ul>
        <!-- data-navigo attribute tells Navigo to intercept this link -->
        <a href="/tasks" data-navigo class="btn btn-primary mt-6 inline-block">
          View Tasks →
        </a>
      </div>
    </div>
  `;
  // CRITICAL: Tell Navigo to attach click handlers to all links with data-navigo
  // Without this, clicking links would cause full page reloads
  router.updatePageLinks();
}

function renderAbout(appElement: HTMLElement) {
  appElement.innerHTML = `
    <div class="container mx-auto max-w-4xl px-4 py-8">
      <div class="card">
        <h2 class="text-3xl font-bold mb-4 text-gray-800">About This App</h2>
        <p class="text-gray-600 mb-4">
          This is a learning project to master modern web development technologies.
        </p>
        <p class="text-gray-600">
          Built as a Progressive Web App with offline support, testing, and best practices.
        </p>
      </div>
    </div>
  `;
  router.updatePageLinks();
}

// Track active subscriptions for cleanup
const activeSubscriptions = new Set<() => void>();

// Replace the renderTasks function:
function renderTasks(appElement: HTMLElement) {
  appElement.innerHTML = `
    <div class="container mx-auto max-w-4xl px-4 py-8">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">My Tasks</h2>
      <button id="refresh-btn" class="btn btn-secondary mb-4">
        🔄 Refresh Tasks
      </button>
      <div id="task-list">
        <p class="text-gray-600">Loading tasks...</p>
      </div>
    </div>
  `;
  router.updatePageLinks();

  const refreshBtn = appElement.querySelector('#refresh-btn');
  refreshBtn?.addEventListener('click', () => {
    void loadTasks(appElement);
  });

  // Subscribe to store changes
  const unsubscribe = taskStore.subscribe(() => {
    renderTaskList(appElement);
  });

  // Track for cleanup on route change
  activeSubscriptions.add(unsubscribe);

  // Initial load
  if (taskStore.getTasks().length === 0) {
    void loadTasks(appElement);
  } else {
    renderTaskList(appElement);
  }
}

async function loadTasks(appElement: HTMLElement) {
  const taskList = appElement.querySelector('#task-list')!;

  try {
    const tasks = await fetchTasks();
    taskStore.setTasks(tasks);
  } catch {
    taskList.innerHTML = '<p class="text-red-600">Failed to load tasks. Please try again.</p>';
  }
}

function renderTaskList(appElement: HTMLElement) {
  const taskList = appElement.querySelector('#task-list')!;
  const tasks = taskStore.getTasks();

  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="text-gray-600">No tasks found.</p>';
    return;
  }

  taskList.innerHTML = ''; // Clear and recreate all cards

  tasks.forEach((task: Task) => {
    const taskCard = document.createElement('task-card');
    taskCard.setAttribute('title', task.title);
    taskCard.setAttribute('description', `Task #${task.id}`);
    if (task.completed) {
      taskCard.setAttribute('completed', '');
    }

    // Handle toggle complete
    taskCard.addEventListener('toggle-complete', () => {
      void (async () => {
        const previousState = task.completed;

        try {
          // Optimistic update - update UI immediately
          taskStore.updateTask(task.id, { completed: !task.completed });

          // Then sync with server
          await updateTask(task.id, { completed: !task.completed });
        } catch (error) {
          console.error('Failed to update task:', error);
          // Rollback on failure
          taskStore.updateTask(task.id, { completed: previousState });
          alert('Failed to update task. Please try again.');
        }
      })();
    });

    // Handle delete
    taskCard.addEventListener('delete-task', () => {
      void (async () => {
        const taskCopy = { ...task };
        let originalIndex: number = -1;

        try {
          // Optimistic delete - remove from UI immediately, save index
          originalIndex = taskStore.removeTask(task.id);

          // Then sync with server
          await deleteTask(task.id);
        } catch (error) {
          console.error('Failed to delete task:', error);
          // Rollback on failure - restore the task at its original position
          if (originalIndex >= 0) {
            taskStore.insertTask(taskCopy, originalIndex);
          } else {
            // Fallback: append at end if index was lost
            const currentTasks = taskStore.getTasks();
            taskStore.setTasks([...currentTasks, taskCopy]);
          }
          alert('Failed to delete task. Please try again.');
        }
      })();
    });

    taskList.appendChild(taskCard);
  });
}
