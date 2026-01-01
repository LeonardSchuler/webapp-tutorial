import './style.css';
// Import components to register them with customElements
// The imports execute customElements.define() for each component
import './components/AppHeader';
import './components/TaskCard';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Demonstrate reusability: Use the same components multiple times with different data
app.innerHTML = `
  <div class="min-h-screen bg-gray-100">
    <!-- AppHeader component - used once for the page header -->
    <app-header></app-header>

    <main class="container mx-auto max-w-4xl px-4 py-8">
      <div class="card mb-6">
        <h2 class="text-3xl font-bold mb-4 text-gray-800">Web Components Demo</h2>
        <p class="text-gray-600 mb-2">
          Notice how we can reuse the same <code class="bg-gray-200 px-1 rounded">&lt;task-card&gt;</code>
          component multiple times with different attributes. Each instance is independent and encapsulated!
        </p>
      </div>

      <!-- TaskCard components - reused multiple times with different data -->
      <task-card
        title="Learn Web Components"
        description="Understanding the native Web Components API">
      </task-card>

      <task-card
        title="Build TaskCard Component"
        description="Create a reusable task card with Shadow DOM"
        completed>
      </task-card>

      <task-card
        title="Build AppHeader Component"
        description="Create a reusable header with navigation"
        completed>
      </task-card>

      <task-card
        title="Test Component Reusability"
        description="Use the same component multiple times with different attributes">
      </task-card>
    </main>
  </div>
`;

// Add event listeners to demonstrate component events
document.querySelectorAll('task-card').forEach(card => {
  card.addEventListener('toggle-complete', (e) => {
    console.log('Task toggled:', e.target);
    // In a real app, this would update your state/API
    const target = e.target as HTMLElement;
    if (target.hasAttribute('completed')) {
      target.removeAttribute('completed');
    } else {
      target.setAttribute('completed', '');
    }
    // Force re-render by reconnecting (simplified for demo)
    const parent = target.parentElement;
    const next = target.nextSibling;
    parent?.removeChild(target);
    parent?.insertBefore(target, next);
  });

  card.addEventListener('delete-task', (e) => {
    console.log('Task deleted:', e.target);
    (e.target as HTMLElement).remove();
  });
});