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