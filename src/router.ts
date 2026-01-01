import Navigo from 'navigo';

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
      appElement.innerHTML = '<div class="container mx-auto p-8"><h1 class="text-4xl">404 - Page Not Found</h1></div>';
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

function renderTasks(appElement: HTMLElement) {
  appElement.innerHTML = `
    <div class="container mx-auto max-w-4xl px-4 py-8">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">My Tasks</h2>
      <div id="task-list">
        <p class="text-gray-600">Loading tasks...</p>
      </div>
    </div>
  `;
  router.updatePageLinks();

  // We'll load tasks via Fetch API in the next step
  loadTasks();
}

// Placeholder for next step
async function loadTasks() {
  // Will implement in Step 5
}