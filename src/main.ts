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