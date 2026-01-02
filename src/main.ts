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
