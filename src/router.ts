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

  if (!taskStore.isLoaded) {
    console.log('Loading tasks from API');
    void loadTasks(appElement);
  } else {
    console.log('Using cached tasks');
    renderTaskList(appElement);
  }
}

async function loadTasks(appElement: HTMLElement) {
  const taskList = appElement.querySelector('#task-list')!;

  try {
    console.log('Fetching tasks from API...');
    const tasks = await fetchTasks();
    console.log('Fetched tasks:', tasks.length);
    taskStore.tasks = tasks;
    taskStore.isLoaded = true;
    renderTaskList(appElement);
  } catch {
    taskList.innerHTML = '<p class="text-red-600">Failed to load tasks. Please try again.</p>';
  }
}

function renderTaskList(appElement: HTMLElement) {
  const taskList = appElement.querySelector('#task-list')!;
  const tasks = taskStore.tasks;

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
          const index = taskStore.tasks.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            taskStore.tasks[index] = { ...taskStore.tasks[index], completed: !task.completed };
          }
          renderTaskList(appElement);

          // Then sync with server
          await updateTask(task.id, { completed: !task.completed });
        } catch (error) {
          console.error('Failed to update task:', error);
          // Rollback on failure
          const index = taskStore.tasks.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            taskStore.tasks[index] = { ...taskStore.tasks[index], completed: previousState };
          }
          renderTaskList(appElement);
          alert('Failed to update task. Please try again.');
        }
      })();
    });

    // Handle delete
    taskCard.addEventListener('delete-task', () => {
      void (async () => {
        const taskCopy = { ...task };
        const originalIndex = taskStore.tasks.findIndex((t) => t.id === task.id);

        try {
          // Optimistic delete - remove from UI immediately
          taskStore.tasks = taskStore.tasks.filter((t) => t.id !== task.id);
          renderTaskList(appElement);

          // Then sync with server
          await deleteTask(task.id);
        } catch (error) {
          console.error('Failed to delete task:', error);
          // Rollback on failure - restore the task at its original position
          if (originalIndex >= 0) {
            taskStore.tasks.splice(originalIndex, 0, taskCopy);
          } else {
            // Fallback: append at end if index was lost
            taskStore.tasks = [...taskStore.tasks, taskCopy];
          }
          renderTaskList(appElement);
          alert('Failed to delete task. Please try again.');
        }
      })();
    });

    taskList.appendChild(taskCard);
  });
}
