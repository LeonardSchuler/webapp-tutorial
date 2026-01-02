# Modern Web Development Tutorial
## Building a Task Manager PWA with Vite + TypeScript

This tutorial will teach you these technologies by building a real application:
- Vite (Dev server + build)
- ESLint + Prettier (Code quality)
- Tailwind CSS (Styling)
- Navigo (Client routing)
- Fetch API (HTTP requests)
- Vitest + Testing Library (Testing)
- Web Components (UI components)
- Workbox (PWA support)

## Tutorial Roadmap

## Table of Contents

- [Phase 0: Project Setup](#phase-0-project-setup)
  - [Step 0: Create Vite Project](#step-0-create-vite-project)
- [Phase 1: Setup & Configuration](#phase-1-setup--configuration)
  - [Step 1: ESLint + Prettier Setup](#step-1-eslint--prettier-setup)
  - [Step 2: Tailwind CSS Setup](#step-2-tailwind-css-setup)
- [Phase 2: Core Features](#phase-2-core-features)
  - [Step 3: Web Components](#step-3-web-components)
  - [Step 4: Navigo Routing](#step-4-navigo-routing)
  - [Step 5: Fetch API & Data Caching](#step-5-fetch-api--data-caching)
- [Phase 3: Quality & PWA](#phase-3-quality--pwa)
  - [Step 6: Vitest + Testing Library](#step-6-vitest--testing-library)
  - [Step 7: Workbox PWA](#step-7-workbox-pwa)
- [Summary](#summary)
- [Next Steps](#next-steps)
- [Useful Commands](#useful-commands)

**Estimated time:** 2-3 hours
**Prerequisites:** Basic JavaScript/TypeScript knowledge
**What you'll build:** A fully functional, offline-capable task manager

---

## Phase 0: Project Setup

### Step 0: Create Vite Project

**What you'll learn:** Scaffolding a modern Vite + TypeScript project from scratch.

**Create Vite project:**
```bash
npm create vite@latest webapp
```

When prompted, choose:
- **Select a framework:** → `Vanilla`
- **Select a variant:** → `TypeScript`
- **Use rolldown-vite (Experimental)?** → `Yes` (faster Rust-based bundler) or `No` (standard Vite)
- **Install with npm and start now?** → `Yes`

This will:
- Create `package.json`, `tsconfig.json`, `index.html`
- Create `src/` and `public/` directories with demo files
- Install dependencies
- Configure Vite for TypeScript

> **Note on rolldown-vite:**
>
> Rolldown is an experimental Rust-based bundler that's significantly faster than the standard Vite build. It's compatible but may have occasional edge cases. Choose `Yes` for speed, `No` for stability.


**Verify the setup works:**
Visit http://localhost:5173 - you should see the Vite welcome page.
Alternatively run
```bash
npm run dev
```

**Clean up demo files:**
```bash
# Remove demo files - we'll create our own
rm src/counter.ts
rm src/typescript.svg
```


**Your project structure should now look like:**
```
webapp/
├── node_modules/
├── public/
│   └── vite.svg         # Logo
├── src/
│   ├── main.ts          # Entry point
│   └── style.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
└── tsconfig.json        # TypeScript config
```

---

## Phase 1: Setup & Configuration

### Step 1: ESLint + Prettier Setup

**What you'll learn:** Code quality tools that automatically catch errors and format your code consistently.

**Generate ESLint configuration:**
```bash
npm init @eslint/config@latest
```

When prompted, choose:
- **What do you want to lint?** → `javascript`
- **How would you like to use ESLint?** → `problems`
- **What type of modules does your project use?** → `esm`
- **Which framework does your project use?** → `none`
- **Does your project use TypeScript?** → `Yes`
- **Where does your code run?** → `browser`
- **Which language do you want your configuration file be written in?** → `ts`
- **Would you like to add Jiti as a devDependency?** → `Yes` (needed for TS config files)
- **Would you like to install them now?** → `Yes`
- **Which package manager do you want to use?** → `npm`

This will create `eslint.config.ts` and install: `eslint`, `@eslint/js`, `globals`, `typescript-eslint`, `jiti`

> **Why use the config generator?**
>
> The `@eslint/config` generator:
> - ✅ Automatically installs correct dependency versions
> - ✅ Creates a working config based on your project setup
> - ✅ Uses the modern flat config format (ESLint 9+)
> - ✅ Handles TypeScript configuration complexity
>
> Much easier than manual setup!

**Enhance the generated `eslint.config.ts`:**
```typescript
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]);
```

**Install Prettier:**
```bash
npm install -D prettier eslint-config-prettier
```

**Add Prettier to `eslint.config.ts`:**
```typescript
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  prettierConfig, // Disables ESLint rules that conflict with Prettier
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]);
```

**Create `.prettierrc`:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**Update `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{ts,css,html}\""
  }
}
```

**Include eslint.config.ts in `tsconfig.json`:**
```json
  "include": ["src", "eslint.config.ts"]
```
This allows linting to run on eslint.config.ts as well.


**Test it:**
```bash
npm run lint
npm run format
```

---

### Step 2: Tailwind CSS Setup

**What you'll learn:** Utility-first CSS framework for rapid UI development using the official Vite plugin.

**Install Tailwind CSS:**
```bash
npm install -D tailwindcss @tailwindcss/vite
```
The official Tailwind docs recommend a non-dev (without `-D`) install. However, we stick with the convention that build tools are considered dev dependencies.

**Configure the Vite plugin:**

Create `vite.config.ts` with the Tailwind plugin:
```typescript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```
Add the vite.config.ts file to tsconfig.json to enable linting on the file:
```json
  "include": [
    "src",
    "eslint.config.ts",
    "vite.config.ts"
  ]
```


**Replace `src/style.css` with Tailwind import:**
```css
@import "tailwindcss";

/* Custom styles */
@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-semibold transition-colors duration-200;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}
```

**Test it - Update `src/main.ts`:**
```typescript
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-4xl font-bold text-center text-blue-600 mb-8">
        Task Manager PWA
      </h1>
      <div class="card">
        <p class="text-gray-700 mb-4">Tailwind CSS is working!</p>
        <button class="btn btn-primary">Click Me</button>
      </div>
    </div>
  </div>
`;
```
> Note: The `!` in `document.querySelector<HTMLDivElement>('#app')!` tells TypeScript: "I know this value won't be null or undefined, even though the type system thinks it might be

**Run dev server:**
```bash
npm run dev
```

Visit http://localhost:5173 - you should see the styled content:
![Tailwind CSS setup](./images/tailwind.png)


---

## Phase 2: Core Features

### Step 3: Web Components

**What you'll learn:** Create reusable, encapsulated custom HTML elements using the native Web Components API.

**Documentation:** [MDN Web Components Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

> **Understanding the Web Components API**
>
> Web Components are a suite of **native browser features** (not a library or framework!) that let you create reusable custom elements:
>
> **Key Browser APIs:**
> - `customElements` - Global registry for custom elements (also available as `window.customElements`)
> - `HTMLElement` - Base class that all custom elements extend (also `window.HTMLElement`)
> - `ShadowRoot` - Interface for the shadow DOM tree (also `window.ShadowRoot`)
>
> **No imports needed!** These APIs are built into modern browsers:
> ```typescript
> // customElements is a global object - no import required
> customElements.define('my-element', MyElement);
>
> // HTMLElement is the base class for all custom elements
> class MyElement extends HTMLElement {
>   constructor() {
>     super(); // Always call super() first
>   }
> }
> ```
>
> **Understanding Shadow DOM:**
>
> Shadow DOM creates an **isolated DOM tree** attached to an element. Think of it as a separate mini-document that's hidden from the main page:
>
> ```typescript
> class MyElement extends HTMLElement {
>   constructor() {
>     super();
>     // Create a shadow root - this is the "container" for your isolated DOM
>     this.attachShadow({ mode: 'open' });
>     // Now this.shadowRoot exists and can contain HTML
>   }
> }
> ```
>
> **Why use Shadow DOM?**
> - **Style encapsulation** - CSS inside shadow DOM won't leak out; CSS from outside won't leak in
> - **DOM encapsulation** - Internal structure is hidden from external JavaScript queries
> - **Prevents conflicts** - No ID collisions, no accidental style overrides
>
> **Shadow DOM modes:**
> - **`mode: 'open'`** (recommended) - JavaScript outside can access the shadow root
>   ```typescript
>   const element = document.querySelector('my-element');
>   element.shadowRoot.querySelector('.internal-class'); // ✅ Works
>   ```
> - **`mode: 'closed'`** - Shadow root is completely private, `element.shadowRoot` returns `null`
>   ```typescript
>   const element = document.querySelector('my-element');
>   element.shadowRoot; // ❌ Returns null
>   ```
>   Note: `closed` mode offers little security benefit (can still be bypassed) and makes debugging harder. **Use `open` mode** unless you have a specific reason not to.
>
> **Example - Light (regular) DOM vs Shadow DOM:**
> ```typescript
> // Without Shadow DOM (Light DOM)
> class LightElement extends HTMLElement {
>   connectedCallback() {
>     this.innerHTML = '<div class="box">I am affected by external CSS</div>';
>   }
> }
>
> // With Shadow DOM
> class ShadowElement extends HTMLElement {
>   constructor() {
>     super();
>     this.attachShadow({ mode: 'open' });
>   }
>
>   connectedCallback() {
>     this.shadowRoot.innerHTML = `
>       <style>
>         .box { color: blue; padding: 10px; }
>       </style>
>       <div class="box">I am isolated from external CSS</div>
>     `;
>   }
> }
> ```
>
> **How to work with Shadow DOM:**
> ```typescript
> class TaskCard extends HTMLElement {
>   private shadow: ShadowRoot;
>
>   constructor() {
>     super();
>     // Create shadow root in constructor
>     this.shadow = this.attachShadow({ mode: 'open' });
>   }
>
>   connectedCallback() {
>     // Add content to shadow root (not to this.innerHTML!)
>     this.shadow.innerHTML = `
>       <style>
>         /* Styles here only affect this component */
>         p { color: red; }
>       </style>
>       <p>Hello from Shadow DOM!</p>
>     `;
>
>     // Query inside shadow DOM
>     const paragraph = this.shadow.querySelector('p');
>   }
> }
> ```
>
> **Key differences:**
> | Operation | Light DOM (no shadow) | Shadow DOM |
> |-----------|----------------------|------------|
> | Set content | `this.innerHTML = ...` | `this.shadowRoot.innerHTML = ...` |
> | Query elements | `this.querySelector(...)` | `this.shadowRoot.querySelector(...)` |
> | CSS scope | Global (affected by page styles) | Isolated (only internal styles apply) |
> | Access from outside | ✅ Easy with `querySelector` | ⚠️ Requires `element.shadowRoot.querySelector` |
>
> **Web Component Lifecycle Callbacks:**
>
> Custom elements have built-in lifecycle methods that the browser automatically calls:
>
> - **`connectedCallback()`** - Called when the element is inserted into the DOM
>   - Most common place to set up rendering and event listeners
>   - Can be called multiple times if element is moved
>   - Safe to access attributes and set up Shadow DOM content here
>
> - **`disconnectedCallback()`** - Called when the element is removed from the DOM
>   - Use this to clean up: remove event listeners, cancel timers, etc.
>   - Prevents memory leaks
>
> - **`attributeChangedCallback(name, oldValue, newValue)`** - Called when an observed attribute changes
>   - Must define `static observedAttributes = ['attr1', 'attr2']` to specify which attributes to watch
>   - Useful for reactive updates when attributes change
>   - Only observes attributes listed in `observedAttributes`
>
> - **`adoptedCallback()`** - Called when element is moved to a new document
>   - Rarely used (mainly for iframe scenarios)
>
> **Example with lifecycle callbacks:**
> ```typescript
> class MyElement extends HTMLElement {
>   static observedAttributes = ['title', 'status'];
>
>   constructor() {
>     super();
>     this.attachShadow({ mode: 'open' });
>   }
>
>   connectedCallback() {
>     // Render when element is added to DOM
>     this.render();
>   }
>
>   disconnectedCallback() {
>     // Clean up when removed
>     this.cleanup();
>   }
>
>   attributeChangedCallback(name, oldValue, newValue) {
>     // Re-render when observed attributes change
>     if (oldValue !== newValue) {
>       this.render();
>     }
>   }
> }
> ```

**Create `src/components/TaskCard.ts`:**
```typescript
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
```

> **Attributes vs Properties:**
>
> This component uses HTML **attributes** (`title`, `completed`) for simplicity. Attributes are:
> - ✅ Easy to use from templates (`<task-card title="...">`))
> - ✅ Visible in DevTools
> - ❌ Limited to strings only
>
> For production apps with complex state, consider using **properties** instead:
> ```typescript
> // Instead of: taskCard.setAttribute('completed', '')
> // Use: taskCard.completed = true
> ```
> Properties support any data type (objects, arrays, booleans) and are more performant for frequent updates.

> **Important: Tailwind CSS and Shadow DOM**
>
> Tailwind utilities **cannot cross Shadow DOM boundaries**. Web Components with Shadow DOM are isolated from global styles, which is by design for encapsulation.
>
> **Design decision for this tutorial:**
> - Page-level layouts and routing → Use Tailwind utilities
> - Web Components (Shadow DOM) → Use inline `<style>` tags for full encapsulation
>
> **Alternative: Light DOM Web Components with Tailwind**
>
> If you don't need style encapsulation, you can skip Shadow DOM and use Tailwind directly:
> ```typescript
> export class TaskCard extends HTMLElement {
>
>   connectedCallback() {
>     const title = this.getAttribute('title') || 'Untitled';
>     const description = this.getAttribute('description') || '';
>     const completed = this.hasAttribute('completed');
>
>     this.innerHTML = `
>       <div class="bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 ${completed ? 'border-green-500' : 'border-blue-500'}">
>         <h3 class="text-xl font-bold mb-2 ${completed ? 'line-through text-gray-500' : 'text-gray-900'}">${title}</h3>
>         <p class="text-gray-600 mb-4">${description}</p>
>         <div class="flex gap-2">
>           <button class="btn-complete px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${completed ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-green-600 text-white hover:bg-green-700'}">
>             ${completed ? 'Undo' : 'Complete'}
>           </button>
>           <button class="btn-delete px-4 py-2 rounded-lg font-semibold transition-colors duration-200 bg-red-600 text-white hover:bg-red-700">
>             Delete
>           </button>
>         </div>
>       </div>
>     `;
>
>     this.setupEventListeners();
>   }
>
>   private setupEventListeners() {
>     this.querySelector('.btn-complete')?.addEventListener('click', () => {
>       // Dispatch custom events that bubble through Shadow DOM (composed: true)
>       this.dispatchEvent(new CustomEvent('toggle-complete', {
>         bubbles: true,
>         composed: true
>       }));
>     });
>
>     this.querySelector('.btn-delete')?.addEventListener('click', () => {
>       this.dispatchEvent(new CustomEvent('delete-task', {
>         bubbles: true,
>         composed: true
>       }));
>     });
>   }
> }
>
> customElements.define('task-card', TaskCard);
> ```
> Note: You might need to restart your development server (`npm run dev`) when switching TaskCard to Light DOM.
>
> **Trade-offs:**
> - ✅ Can use Tailwind utilities directly
> - ✅ Simpler code (no shadow root management)
> - ❌ No style encapsulation (global CSS can affect your component)
> - ❌ Your component CSS can leak out and affect the page
> - ❌ Class name collisions possible
>
> **When to use each approach:**
> - **Shadow DOM**: Reusable components meant for sharing/libraries, need strong isolation
> - **Light DOM**: App-specific components, want consistent styling with Tailwind
>
> **Optional: Share design tokens across Shadow DOM** using CSS custom properties:
> ```css
> /* In your global style.css */
> :root {
>   --color-primary: #3b82f6;
>   --color-success: #10b981;
> }
> ```
> Then reference them inside Shadow DOM: `color: var(--color-primary);`
>
> CSS custom properties (variables) **do** cross Shadow DOM boundaries, making them perfect for theming!

**Create `src/components/AppHeader.ts`:**
```typescript
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
```

**Test the components - Update `src/main.ts`:**
```typescript
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
```

**Run the demo:**
```bash
npm run dev
```

Visit http://localhost:5173 - you should see:
- One `<app-header>` component at the top
- Four different `<task-card>` components, each with unique content
- Click "Complete" or "Delete" buttons to interact with them
- Open DevTools and inspect the Shadow DOM of each component

![Web Compoment Demo](./images/webComponents.png)

> **Key Takeaway: Reusability**
>
> Notice how we:
> 1. **Defined once** - Created `TaskCard` class and registered it with `customElements.define()`
> 2. **Used multiple times** - Created 4 different task cards with different attributes
> 3. **Encapsulated** - Each card has its own isolated styles and behavior
> 4. **Interactive** - Each card independently handles its own events
>
> This is the power of Web Components! Once you define a custom element, you can use it anywhere in your HTML just like a native element (`<div>`, `<button>`, etc.).

---

### Step 4: Navigo Routing

**What you'll learn:** Client-side routing for single-page applications.

> **Understanding Client-Side Routing:**
>
> Traditional websites reload the entire page when you click a link. Single-Page Applications (SPAs) work differently:
> - Only the content area changes, no full page reload
> - Faster navigation and smoother user experience
> - Browser history (back/forward buttons) still works
> - URLs reflect the current view (can bookmark/share specific pages)
>
> **How Navigo works:**
> 1. Intercepts link clicks (via `data-navigo` attribute)
> 2. Uses the History API (`pushState`) to update the URL without reloading
> 3. Matches the new URL against registered route patterns
> 4. Calls the corresponding render function
> 5. Updates only the content area with new HTML

**Install dependencies:**
```bash
npm install navigo
```

**Create `src/router.ts`:**
```typescript
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
```

> **Important: `router.updatePageLinks()` explained:**
>
> Every time you render new HTML with `innerHTML`, you must call `router.updatePageLinks()`. Here's why:
>
> **Without `updatePageLinks()`:**
> ```typescript
> appElement.innerHTML = '<a href="/tasks" data-navigo>Tasks</a>';
> // ❌ Link has NO click handler attached
> // ❌ Clicking causes full page reload (traditional navigation)
> ```
>
> **With `updatePageLinks()`:**
> ```typescript
> appElement.innerHTML = '<a href="/tasks" data-navigo>Tasks</a>';
> router.updatePageLinks();
> // ✅ Navigo scans for all [data-navigo] links
> // ✅ Attaches click event listeners to intercept navigation
> // ✅ Clicking triggers client-side routing (no reload)
> ```
>
> **What happens behind the scenes:**
> 1. Navigo finds all links with `data-navigo` attribute
> 2. Adds click event listeners that call `event.preventDefault()`
> 3. Extracts the `href` value from the link
> 4. Uses `history.pushState()` to update browser URL without reload
> 5. Matches the URL against registered routes
> 6. Calls the matching render function
>
> **Rule of thumb:** Call `updatePageLinks()` after every `innerHTML` assignment that contains navigation links.

> **Alternative: Programmatic Navigation**
>
> You can also navigate programmatically without links:
> ```typescript
> // Navigate to a route from JavaScript
> router.navigate('/tasks');
>
> // Useful for redirects after form submissions, authentication, etc.
> ```

**Important: Navigo and Shadow DOM**

The `AppHeader` component will **not work correctly** with client-side routing as-is. Here's why:

**The Problem:**
- `router.updatePageLinks()` only scans the **Light DOM** for `[data-navigo]` links
- Links inside Shadow DOM are **isolated** and invisible to external JavaScript
- Result: Clicking header links causes **full page reloads** instead of client-side navigation

**The Solution:**
You need to manually attach click handlers inside the Shadow DOM. Update `AppHeader.ts`:

```typescript
import { router } from '../router';

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

    // CRITICAL: Manually attach navigation handlers for Shadow DOM links
    this.attachNavigationHandlers();
  }

  private attachNavigationHandlers() {
    // Find all links with data-navigo in shadow DOM
    const links = this.shadow.querySelectorAll('a[data-navigo]');

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default browser navigation
        const href = (link as HTMLAnchorElement).getAttribute('href');
        if (href) {
          router.navigate(href); // Use Navigo's client-side navigation
        }
      });
    });
  }
}

customElements.define('app-header', AppHeader);
```

**What changed:**
1. **Import router** - `import { router } from '../router'` at the top
2. **Call attachNavigationHandlers()** - Added after setting `innerHTML` in `connectedCallback()`
3. **Manual click handlers** - Query Shadow DOM links and attach click listeners that:
   - Prevent default browser navigation (`e.preventDefault()`)
   - Use Navigo's programmatic navigation (`router.navigate(href)`)

**Why this is necessary:**
- Shadow DOM creates an **encapsulation boundary**
- Navigo's `updatePageLinks()` uses `document.querySelectorAll()`, which only searches the Light DOM
- Links inside Shadow DOM require manual event handling from within the component

> **Alternative: Light DOM for navigation**
> If you don't need style encapsulation for the header, you could skip Shadow DOM:
> ```typescript
> export class AppHeader extends HTMLElement {
>   connectedCallback() {
>     this.innerHTML = `...`; // Use this.innerHTML instead of shadowRoot
>     // No need for manual handlers - router.updatePageLinks() will work
>   }
> }
> ```
> Then call `router.updatePageLinks()` in `main.ts` after rendering the header. This is simpler but loses style isolation.

**Update `src/main.ts`:**
```typescript
import './style.css';
import './components/AppHeader';
import './components/TaskCard';
import { setupRouter } from './router';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Set up the app shell - header stays constant, content changes per route
app.innerHTML = `
  <app-header></app-header>
  <main id="main-content"></main>
`;

// Get reference to the main content area where routes will render
const mainContent = document.querySelector<HTMLElement>('#main-content')!;

// Initialize the router - this calls .resolve() to match the current URL
setupRouter(mainContent);
```

> **Architecture Pattern: App Shell**
>
> Notice the structure:
> ```
> <app-header>  ← Rendered once, stays constant
> <main>        ← Content swapped on each route change
> ```
>
> This is called the **App Shell pattern**:
> - Header/navigation renders once at startup
> - Only the `<main>` content area updates when navigating
> - More efficient than re-rendering the entire page
> - Provides consistent navigation UI across all routes
>
> **Flow summary:**
> 1. User clicks link with `data-navigo` in header
> 2. Navigo intercepts the click, updates URL with `pushState`
> 3. Navigo matches URL to a route handler
> 4. Handler calls render function (e.g., `renderTasks()`)
> 5. Render function updates `mainContent.innerHTML`
> 6. Only the content inside `<main>` changes - header stays the same

**Test routing:**
```bash
npm run dev
```

Navigate between pages using the header links! Notice:
- URL changes in address bar
- Content updates without page reload (check Network tab - no document reload)
- Back/forward buttons work correctly
- You can bookmark specific routes

---

### Step 5: Fetch API & Data Caching

**What you'll learn:** Make HTTP requests to APIs, implement client-side caching, and handle optimistic updates with rollback.

> **Understanding the Fetch API:**
>
> The Fetch API is a modern, promise-based interface for making HTTP requests in the browser. It provides a powerful way to communicate with servers.
>
> **Basic Fetch Flow:**
> 1. Call `fetch(url, options)` - Returns a Promise
> 2. First `.then()` receives the Response object (headers, status, etc.)
> 3. Call `response.json()` to parse the body - Returns another Promise
> 4. Second `.then()` receives the parsed data
> 5. Use `try/catch` with `async/await` for cleaner error handling
>
> **Key concepts we'll implement:**
> - **API Layer** - Separate module for all HTTP requests (clean architecture)
> - **Type Safety** - TypeScript interfaces for API responses
> - **Error Handling** - Graceful failure with user feedback
> - **Client-Side Caching** - Store fetched data in memory to avoid unnecessary requests
> - **Optimistic Updates** - Update UI immediately, sync with server in background
> - **Rollback on Failure** - Revert UI changes if server request fails
>
> **Architecture Pattern: Optimistic UI**
>
> Instead of showing loading spinners for every user action, we'll implement optimistic updates:
> ```
> Traditional:                    Optimistic:
> 1. User clicks "Complete"       1. User clicks "Complete"
> 2. Show loading spinner         2. Update UI immediately ✅
> 3. Wait for server...           3. Send request in background
> 4. Update UI on success         4. If fails → rollback UI
> ```
>
> This makes the app feel instant and responsive, even on slow connections!

**Create `src/api/tasks.ts`:**
```typescript
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
```

**Create `src/store.ts` (Simple State Management):**
```typescript
import type { Task } from './api/tasks';

// Simple state container - keeps tasks in memory
export const taskStore = {
  tasks: [] as Task[],
  isLoaded: false,
};
```

> **Architecture Note:**
>
> This minimal store pattern:
> - Centralizes task state (single source of truth)
> - Uses a simple object to track tasks and loading state
> - The `isLoaded` flag prevents unnecessary API refetches
>
> For more complex apps, consider using reactive state management libraries like signals, Zustand, or similar.

**Update `src/router.ts` to use the API and store:**
```typescript
import Navigo from 'navigo';
import { fetchTasks, updateTask, deleteTask, type Task } from './api/tasks';
import { taskStore } from './store';

...

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
```

> **Web Component Lifecycle Note:**
>
> Our `TaskCard` only reads attributes in `connectedCallback()` — it doesn't observe attribute changes via `attributeChangedCallback()`.
>
> This is acceptable here because we **recreate all cards** on every state change (`taskList.innerHTML = ''`). Each card is a fresh instance that reads current state.
>
> **For production:** If you're updating individual cards without recreating them, implement `attributeChangedCallback()` and `observedAttributes` to react to attribute changes, or use properties instead of attributes.

> **Optimistic Updates with Rollback:**
>
> Notice the pattern:
> 1. Save current state (including position for deletes)
> 2. Update UI immediately (optimistic) by modifying `taskStore.tasks` directly
> 3. Call `renderTaskList()` to update the UI
> 4. Sync with server
> 5. If server fails → rollback to saved state and re-render
>
> **Ordering preservation:** When rolling back a delete, we restore the task at its original index to maintain list order using `splice()`.
>
> This gives users instant feedback while maintaining data consistency. Production apps should also consider:
> - Retry logic with exponential backoff
> - Toast notifications instead of alerts
> - Queuing failed mutations for retry when back online

> **Performance Note:**
>
> The store provides simple caching:
> - Tasks are kept in memory via `taskStore.tasks`
> - The `isLoaded` flag prevents unnecessary API refetches
> - When navigating away from /tasks and back, cached data is used
> - The "Refresh" button allows manual refetching when needed
>
> For production apps with more complex state, consider reactive solutions (signals, Zustand) that automatically trigger re-renders on state changes.

**Test it:**
```bash
npm run dev
```

Navigate to /tasks and see real data from the API!

---

## Phase 3: Quality & PWA

### Step 6: Vitest + Testing Library

**What you'll learn:** Write automated tests for your code.

**Documentation:** [Testing Library](https://testing-library.com/) - Excellent guides and best practices for testing user interactions

**Install dependencies:**
```bash
npm install -D vitest jsdom @testing-library/dom @testing-library/user-event @vitest/ui
```

> **Understanding the Testing Stack:**
>
> Each library serves a specific purpose in our testing setup:
>
> **`vitest`** - The Test Runner
> - Finds and executes test files (`.test.ts`)
> - Provides test APIs: `describe()`, `it()`, `expect()`, `beforeEach()`, `vi.fn()`
> - Blazingly fast - reuses Vite's transformation pipeline
> - Compatible with Jest API, but built for Vite
>
> **`jsdom`** - Browser Environment Simulator
> - Creates a fake browser environment in Node.js
> - Provides `window`, `document`, `HTMLElement`, and other DOM APIs
> - Without it, code using `document.querySelector()` would crash in tests
> - Lightweight alternative to running tests in a real browser
>
> **`@testing-library/dom`** - DOM Testing Utilities
> - Query helpers: `getByText()`, `getByRole()`, `queryByTestId()`
> - Encourages testing from the user's perspective (what they see/interact with)
> - Includes `cleanup()` to reset DOM between tests
> - Philosophy: "The more your tests resemble how users interact with your app, the more confidence they give you"
>
> **`@testing-library/user-event`** - User Interaction Simulation
> - Simulates realistic user actions: `click()`, `type()`, `hover()`
> - More thorough than direct methods (fires all related events a real user would trigger)
> - Handles edge cases like focus, blur, keyboard navigation
> - Makes tests more realistic and reliable
>
> **`@vitest/ui`** - Visual Test Dashboard
> - Web-based UI for viewing test results (`npm run test:ui`)
> - Shows execution time, pass/fail status, and error details
> - Much easier to browse than terminal output
> - Great for debugging and monitoring test suites
>
> **How they work together:**
> ```
> vitest (runs tests)
>   → jsdom (provides browser APIs)
>     → @testing-library/dom (finds elements)
>       → @testing-library/user-event (simulates interactions)
>         → @vitest/ui (displays results)
> ```

> **Test File Organization:**
>
> We follow the **co-located** test pattern - test files live next to the source code they test:
> - `src/api/tasks.ts` → `src/api/tasks.test.ts`
> - `src/components/TaskCard.ts` → `src/components/TaskCard.test.ts`
>
> This is the modern standard in Vite/React/Vue projects because:
> - Tests are easy to find (right next to the code)
> - Clear 1:1 relationship between code and tests
> - Easier to maintain when moving or deleting files
>
> Each test file manages its own setup and cleanup using `beforeEach()` and `afterEach()` hooks.

**Create `vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
```

**Add the vitest.config.ts file to tsconfig.json to enable linting on the file:**
```json
  "include": [
    "src",
    "eslint.config.ts",
    "vite.config.ts",
    "vitest.config.ts"
  ]
```

> **Configuration options explained:**
>
> - **`globals: true`** - Use `describe()`, `it()`, `expect()` without importing them in every test file
> - **`environment: 'jsdom'`** - Simulates a browser environment (provides `window`, `document`, DOM APIs)

**Create `src/api/tasks.test.ts`:**

> **Understanding Vitest Test Functions:**
>
> Before writing tests, let's understand the key functions from Vitest:
>
> **`describe(name, fn)`** - Groups related tests into a test suite
> - Organizes tests logically (e.g., all Task API tests together)
> - Can be nested for more structure
> - Example: `describe('Task API', () => { /* tests */ })`
>
> **`it(name, fn)`** (or `test()`) - Defines a single test case
> - Each `it` is one test that checks one behavior
> - Name should describe what's being tested
> - Example: `it('should fetch tasks', () => { /* ... */ })`
>
> **`expect(value)`** - Makes assertions about values
> - Checks if your code produces the expected result
> - Common matchers: `.toBe()`, `.toEqual()`, `.toHaveLength()`, `.toThrow()`
> - Example: `expect(result).toEqual(expectedValue)`
>
> **`vi`** - Vitest utilities for mocking and spying
> - `vi.fn()` - Creates a mock function
> - `vi.stubGlobal()` - Mocks global variables like `fetch`
> - `vi.clearAllMocks()` - Clears mock call history
> - Example: `const mockFn = vi.fn()`
>
> **`beforeEach(fn)`** - Runs before each test
> - Sets up fresh test environment for every test
> - Also: `afterEach()`, `beforeAll()`, `afterAll()`
> - Example: `beforeEach(() => { /* setup */ })`
>
> **Typical test structure (AAA pattern):**
> ```typescript
> describe('MyFunction', () => {
>   it('should do something', () => {
>     // Arrange - Set up test data
>     const input = 'test';
>
>     // Act - Execute the code being tested
>     const result = doSomething(input);
>
>     // Assert - Check the result
>     expect(result).toBe('expected');
>   });
> });
> ```

```typescript
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
```

> **Mocking `fetch` with Vitest:**
>
> We use `vi.stubGlobal()` to mock the global `fetch` function:
> ```typescript
> const mockFetch = vi.fn();
> vi.stubGlobal('fetch', mockFetch);
> ```
>
> **Why this approach:**
> - Type-safe - no need for `global` or `globalThis` TypeScript issues
> - Vitest-specific - uses the official Vitest mocking API
> - Automatically cleaned up between tests
> - Clear and explicit about what's being mocked
>
> Each test configures the mock's return value with `mockFetch.mockResolvedValueOnce()` to simulate different API responses.

**Update `package.json` scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Run tests:**
```bash
npm run test
npm run test:ui  # Opens a nice UI

```
**Create `src/components/TaskCard.test.ts`:**

> **Testing Shadow DOM Components:**
>
> Our `TaskCard` uses Shadow DOM for style encapsulation. This means Testing Library's standard queries (`getByText`, `getByRole`, etc.) **won't work** because they only search the Light DOM.
>
> **Why this happens:**
> - Testing Library uses `document.querySelector()` internally
> - Shadow DOM creates an encapsulation boundary
> - Elements inside Shadow DOM are invisible to external queries
>
> **The solution:**
> ```typescript
> // FAIL: This won't work - Testing Library can't see inside Shadow DOM
> const title = screen.getByText('Test Task');
>
> // SUCCESS: This works - manually access shadowRoot
> const shadow = taskCard.shadowRoot;
> const title = shadow?.querySelector('.task-title');
> ```
>
> **Trade-offs:**
> - **Pro:** Shadow DOM provides true style encapsulation
> - **Con:** Requires manual `shadowRoot.querySelector()` in tests
> - **Con:** Can't use Testing Library's semantic queries (`getByRole`, etc.)
>
> **Alternative:** If you need Testing Library's full query capabilities, consider using Light DOM for your components (see the note in Step 3 about Light DOM alternatives).

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import './TaskCard';

describe('TaskCard Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Rendering', () => {
    it('should render task title and description', () => {
      const taskCard = document.createElement('task-card');
      taskCard.setAttribute('title', 'Test Task');
      taskCard.setAttribute('description', 'Test Description');
      container.appendChild(taskCard);

      const shadow = taskCard.shadowRoot;
      expect(shadow?.querySelector('.task-title')?.textContent).toBe('Test Task');
      expect(shadow?.querySelector('.task-description')?.textContent).toBe('Test Description');
    });

    it('should show completed state', () => {
      const taskCard = document.createElement('task-card');
      taskCard.setAttribute('title', 'Completed Task');
      taskCard.setAttribute('completed', '');
      container.appendChild(taskCard);

      // Check that the completed attribute is set
      expect(taskCard.hasAttribute('completed')).toBe(true);

      // Check that the component renders with completed styling in the shadow DOM
      const styleElement = taskCard.shadowRoot?.querySelector('style');
      expect(styleElement?.textContent).toContain('text-decoration: line-through');

      // Verify the complete button shows 'Undo' text
      const completeBtn = taskCard.shadowRoot?.querySelector('.btn-complete');
      expect(completeBtn?.textContent).toBe('Undo');
    });
  });

  describe('User Interactions', () => {
    it('should emit toggle-complete event when user clicks complete button', async () => {
      const user = userEvent.setup();
      const taskCard = document.createElement('task-card');
      taskCard.setAttribute('title', 'Test Task');
      container.appendChild(taskCard);

      let eventFired = false;
      taskCard.addEventListener('toggle-complete', () => {
        eventFired = true;
      });

      const completeBtn = taskCard.shadowRoot?.querySelector('.btn-complete') as HTMLButtonElement;
      await user.click(completeBtn);

      expect(eventFired).toBe(true);
    });

    it('should emit delete-task event when user clicks delete button', async () => {
      const user = userEvent.setup();
      const taskCard = document.createElement('task-card');
      taskCard.setAttribute('title', 'Test Task');
      container.appendChild(taskCard);

      let eventFired = false;
      taskCard.addEventListener('delete-task', () => {
        eventFired = true;
      });

      const deleteBtn = taskCard.shadowRoot?.querySelector('.btn-delete') as HTMLButtonElement;
      await user.click(deleteBtn);

      expect(eventFired).toBe(true);
    });
  });
});

```

> **Test cleanup explained:**
>
> Notice the `afterEach(() => container.remove())` hook. This ensures test isolation by cleaning up the container element created in `beforeEach()`:
>
> ```typescript
> beforeEach(() => {
>   container = document.createElement('div');
>   document.body.appendChild(container); // Add to DOM
> });
>
> afterEach(() => {
>   container.remove(); // Remove from DOM
> });
> ```
>
> **Why this matters:**
> - Each test starts with a fresh, empty container
> - DOM elements from one test don't leak into the next
> - Tests can run in any order without affecting each other
> - Vitest creates a fresh jsdom environment for each test file, so cross-file pollution isn't an issue
>
> This is the standard cleanup pattern for vanilla DOM testing. No global setup file needed!

> **Why use `userEvent` for interactions?**
>
> Notice the "User Interactions" tests use `userEvent.click()` instead of the direct `.click()` method:
>
> ```typescript
> // Direct method (simple but less realistic)
> button.click();
> // Only fires: click event
>
> // userEvent (realistic user simulation)
> await user.click(button);
> // Fires in sequence: mouseover → mousedown → focus → mouseup → click
> // Just like a real user interaction!
> ```
>
> **Key benefits:**
> - Simulates the full event sequence a real user would trigger
> - More likely to catch bugs related to focus, hover states, or event ordering
> - Tests are async (`await`) because real interactions take time
> - Must call `userEvent.setup()` to create a user instance per test
>
> For simple rendering tests, direct assertions are fine. For user interactions, `userEvent` provides more confidence.



---

### Step 7: Workbox PWA

**What you'll learn:** Make your app installable and work offline.

**Install dependencies:**
```bash
npm install -D vite-plugin-pwa
```

> **PWA Registration Approaches:**
>
> The `vite-plugin-pwa` plugin offers two registration strategies:
> 1. **Auto-injection** (default) - Plugin injects registration code automatically
> 2. **Manual registration** - You control when/how the SW registers
>
> For learning purposes, we'll use **auto-injection with prompt for update** to understand the full lifecycle.

**Update `vite.config.ts` to add PWA support:**

Extend your existing config from Step 2 by adding the PWA plugin alongside Tailwind:
```typescript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'prompt', // Ask user before updating
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'Task Manager PWA',
        short_name: 'Tasks',
        description: 'A modern task management Progressive Web App',
        theme_color: '#667eea',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/jsonplaceholder\.typicode\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable in dev mode for testing
      },
    }),
  ],
});
```


**Update `index.html` with PWA meta tags:**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#667eea" />
    <meta name="description" content="A modern task management PWA" />
    <title>Task Manager PWA</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

> **PWA Meta Tags Explained:**
>
> **`<meta name="theme-color" content="#667eea" />`**
> - Controls the color of browser UI elements on mobile devices
> - **Android Chrome:** Colors the address bar and status bar to match your app
> - **iOS Safari:** Tints the status bar (limited support)
> - **Installed PWA:** Colors the app's title bar/header area
> - Creates a more immersive, native app-like experience
> - **Best practice:** Use your app's primary brand color (here: purple-blue `#667eea`)
>
> **`<meta name="description" content="A modern task management PWA" />`**
> - Provides a brief description of your app
> - **Used by:**
>   - Search engines (Google, Bing) - Appears in search results
>   - Social media - Shows when sharing links (Twitter, Facebook, LinkedIn)
>   - Browser bookmarks - Some browsers display this in bookmark info
>   - PWA install prompt - Appears in "Add to Home Screen" dialog
>
> These meta tags are essential for PWA quality and user experience. They help your app feel more native and provide context when users discover, share, or install your app.

**Update src/main.ts to handle PWA updates:**
```typescript
import './style.css';
import './components/AppHeader';
import './components/TaskCard';
import { setupRouter } from './router';
import { registerSW } from 'virtual:pwa-register';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <app-header></app-header>
  <main id="main-content"></main>
`;

const mainContent = document.querySelector<HTMLElement>('#main-content')!;
setupRouter(mainContent);

// Register service worker with update prompt
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available! Reload to update?')) {
      // updateSW(true) returns a Promise, void means we are not awaiting
      void updateSW(true); // Force update
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});
```

> **Understanding `registerSW` and Service Worker Lifecycle:**
>
> **What is `registerSW`?**
> The `registerSW` function (from `virtual:pwa-register`) registers your service worker and provides lifecycle callbacks to control how your app handles updates.
>
> **Function signature:**
> ```typescript
> const updateSW = registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
> ```
>
> **Return value:** A function that can force an update when called with `updateSW(true)`.
>
> **Key Lifecycle Callbacks:**
>
> **`onNeedRefresh()`** - Called when a new version of your app is available
> - Triggered when the service worker detects updated files
> - **Use case:** Prompt the user to reload and get the latest version
> - **Best practice:** Don't force updates - let users choose when to reload
> - In our example: Shows a browser `confirm()` dialog
> - If user accepts: Calls `updateSW(true)` to apply the update immediately
>
> **`onOfflineReady()`** - Called when the app is ready to work offline
> - Triggered after all assets are cached for the first time
> - **Use case:** Notify users that the app will work without internet
> - In our example: Logs to console (in production, show a toast notification)
>
> **Additional callbacks (not used in this tutorial):**
> - **`onRegistered(registration)`** - Called when SW successfully registers
> - **`onRegisterError(error)`** - Called if SW registration fails
> - **`immediate: true`** - Auto-updates without user prompt (not recommended)
>
> **Service Worker Update Flow:**
> ```
> 1. User visits app with old version
> 2. Service worker checks for updates in background
> 3. New version found → onNeedRefresh() fires
> 4. User sees: "New content available! Reload to update?"
> 5. User clicks OK → updateSW(true) is called
> 6. Service worker activates new version
> 7. Page reloads with fresh content
> ```
>
> **Why `registerType: 'prompt'`?**
> We configured the plugin with `registerType: 'prompt'` in `vite.config.ts`. This means the user controls when to update the app.
>
> **Alternative: Auto-update (not recommended)**
> ```typescript
> // registerType: 'autoUpdate' in vite.config.ts
> // No callbacks needed - updates happen silently
> // Bad UX: Can interrupt user workflows
> ```
>
> **Production improvements:**
> Instead of `confirm()` dialogs, consider:
> - Toast notifications (e.g., using a toast library)
> - In-app banners that persist until dismissed
> - "Update available" button in app header
> - Visual indicators without blocking the user

**Add TypeScript type declarations for PWA virtual module:**

Create or update `src/vite-env.d.ts` to include type definitions for the virtual module:
```typescript
/// <reference types="vite-plugin-pwa/client" />
```

> **Understanding Virtual Modules:**
>
> **What are virtual modules?**
> Virtual modules are modules that don't exist as physical files on disk. Instead, they're generated dynamically by Vite plugins during the build process.
>
> **Traditional vs Virtual Modules:**
> ```typescript
> // Traditional: Imports from an actual file on disk
> import { router } from './router';  // → reads src/router.ts
>
> // Virtual: Imports from plugin-generated code
> import { registerSW } from 'virtual:pwa-register';  // → no physical file!
> ```
>
> **How it works:**
> 1. When you write `import ... from 'virtual:pwa-register'`, Vite recognizes the `virtual:` prefix
> 2. The `vite-plugin-pwa` intercepts this import during the build
> 3. The plugin generates JavaScript code on-the-fly based on your configuration
> 4. This generated code (service worker registration logic) is injected into your bundle
> 5. At runtime, your app executes the plugin-generated code
>
> **The TypeScript problem:**
> TypeScript analyzes your code **before** the build runs. When it sees `import { registerSW } from 'virtual:pwa-register'`, it looks for a physical file and finds nothing, causing the error:
> ```
> Cannot find module 'virtual:pwa-register' or its corresponding type declarations
> ```
>
> **The solution:**
> The `/// <reference types="vite-plugin-pwa/client" />` directive tells TypeScript: "This module will exist at build time, here are its types." It loads the official type definitions bundled with the plugin, which includes all types for `registerSW` and its options.
>
> **Why virtual modules are useful:**
> - **Configuration-driven** - Plugin generates different code based on your config
> - **No boilerplate** - You don't maintain service worker registration code manually
> - **Clean project** - No extra files cluttering your src directory
> - **Type-safe** - With proper declarations, you get full TypeScript IntelliSense
>
> **Note:** If you already have a `vite-env.d.ts` file (Vite sometimes creates one by default), just add this reference directive to the top of that file.

> **Architecture Decision:**
>
> We use the plugin's auto-injection with `registerType: 'prompt'`:
> - ✅ Plugin handles SW lifecycle (registration, updates, precaching)
> - ✅ We control UX via `onNeedRefresh` callback
> - ✅ Cleaner than mixing `workbox-window` manual registration
>
> For full manual control, set `injectRegister: false` and use `workbox-window`.

**Build and test PWA:**
```bash
npm run build
npm run preview
```

Open DevTools → Application → Service Workers to see it registered!

Try going offline and refreshing - it still works!

---

## Summary

Congratulations! 🎉 You've built a complete Task Manager PWA from scratch and learned:

### Phase 0: Project Setup
**Vite Project Scaffolding** - Created project with `npm create vite@latest`

### Phase 1: Setup & Configuration
**ESLint + Prettier** - Automated code quality and formatting with `npm init @eslint/config`

**Tailwind CSS** - Utility-first styling with custom components

### Phase 2: Core Features
**Web Components** - Reusable, encapsulated UI elements with Shadow DOM

**Navigo** - Client-side routing for SPAs with cleanup hooks

**Fetch API & Data Caching** - HTTP requests, client-side caching, and optimistic updates with rollback

### Phase 3: Quality & PWA
**Vitest + Testing Library** - Unit and component testing with mocks

**Workbox** - Service workers, offline support, PWA features

### Bonus: Production-Ready Patterns
- Optimistic updates with rollback on failure
- Ordering preservation on data mutations
- Client-side data caching to reduce API calls
- Shadow DOM vs global styles architecture
- Web Component lifecycle management

## Next Steps

To make this production-ready, consider:

1. **Enhanced Features:**
   - Add a form to create new tasks
   - Implement IndexedDB for offline task creation
   - Add task categories and filtering
   - User authentication

2. **Testing:**
   - Add more tests for router and components
   - E2E tests with Playwright
   - Coverage targets (>80%)

3. **PWA Improvements:**
   - Better app icons (192x192, 512x512 PNG)
   - Push notifications
   - Background sync

4. **Architecture:**
   - Consider signals (e.g., @preact/signals-core) for reactive state
   - Add error boundaries
   - Implement retry logic with exponential backoff

5. **Developer Experience:**
   - Add husky for pre-commit hooks
   - Set up CI/CD pipeline
   - Add Storybook for component documentation

## Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run test:ui      # Run tests with UI
```

Happy coding! 🚀
