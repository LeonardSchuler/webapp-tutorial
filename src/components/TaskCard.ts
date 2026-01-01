// Extend HTMLElement - this is part of the Web Components API
// No imports needed for HTMLElement or customElements!
export class TaskCard extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    // Always call super() first when extending HTMLElement
    super();
    // Create a shadow root for style encapsulation
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  // Lifecycle callback: invoked when element is added to the DOM
  connectedCallback() {
    const title = this.getAttribute('title') || 'Untitled';
    const description = this.getAttribute('description') || '';
    const completed = this.hasAttribute('completed');

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .task-card {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-left: 4px solid ${completed ? '#10b981' : '#3b82f6'};
        }
        .task-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1f2937;
          text-decoration: ${completed ? 'line-through' : 'none'};
        }
        .task-description {
          color: #6b7280;
          margin-bottom: 1rem;
        }
        .task-actions {
          display: flex;
          gap: 0.5rem;
        }
        button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .btn-complete {
          background: #10b981;
          color: white;
        }
        .btn-complete:hover {
          background: #059669;
        }
        .btn-delete {
          background: #ef4444;
          color: white;
        }
        .btn-delete:hover {
          background: #dc2626;
        }
      </style>
      <div class="task-card">
        <h3 class="task-title">${title}</h3>
        <p class="task-description">${description}</p>
        <div class="task-actions">
          <button class="btn-complete">${completed ? 'Undo' : 'Complete'}</button>
          <button class="btn-delete">Delete</button>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.shadow.querySelector('.btn-complete')?.addEventListener('click', () => {
      // Dispatch custom events that bubble through Shadow DOM (composed: true)
      this.dispatchEvent(new CustomEvent('toggle-complete', {
        bubbles: true,
        composed: true
      }));
    });

    this.shadow.querySelector('.btn-delete')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-task', {
        bubbles: true,
        composed: true
      }));
    });
  }
}

// Register the custom element with the browser's customElements registry
// No import needed - customElements is a global browser API!
customElements.define('task-card', TaskCard);