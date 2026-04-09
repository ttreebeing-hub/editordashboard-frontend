import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/config/query-client';
import { ToastProvider } from './shared/components/Toast';
import { AppRoutes } from './routes';
import { RoleProvider } from './shared/stores/roleStore';
import { TaskProvider } from './shared/stores/taskStore';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RoleProvider>
          <TaskProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </TaskProvider>
        </RoleProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
