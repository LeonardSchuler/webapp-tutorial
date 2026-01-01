export class AppHeader extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
        }
        header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }
        nav {
          margin-top: 1rem;
        }
        nav a {
          color: white;
          text-decoration: none;
          margin: 0 1rem;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s;
        }
        nav a:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      </style>
      <header>
        <h1>📝 Task Manager</h1>
        <nav>
          <a href="/" data-navigo>Home</a>
          <a href="/tasks" data-navigo>Tasks</a>
          <a href="/about" data-navigo>About</a>
        </nav>
      </header>
    `;
  }
}

// Register the custom element using the global customElements API
customElements.define('app-header', AppHeader);