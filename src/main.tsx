import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKING === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass', // không warn cho request ngoài mock
    });
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
