import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import type { Task, TaskStep } from '../types/editor.types';
import { MOCK_TASKS_V2 } from '../../mocks/data';

const LS_KEY = 'nl2_tasks';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as Task[];
  } catch { /* ignore */ }
  return MOCK_TASKS_V2;
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(tasks));
}

interface TaskState {
  tasks: Task[];
  addTask: (t: Task) => void;
  updateTaskStep: (id: string, step: TaskStep) => void;
  approveTask: (id: string) => void;
  rejectTask: (id: string) => void;
  setPend: (id: string, pend: boolean) => void;
}

const TaskContext = createContext<TaskState>({
  tasks: [],
  addTask: () => {},
  updateTaskStep: () => {},
  approveTask: () => {},
  rejectTask: () => {},
  setPend: () => {},
});

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  const update = useCallback((next: Task[]) => {
    setTasks(next);
    saveTasks(next);
  }, []);

  const addTask = useCallback((t: Task) => {
    update([...tasks, t]);
  }, [tasks, update]);

  const updateTaskStep = useCallback((id: string, step: TaskStep) => {
    update(tasks.map(t => t.id === id ? { ...t, step } : t));
  }, [tasks, update]);

  const approveTask = useCallback((id: string) => {
    update(tasks.map(t => t.id === id ? { ...t, step: 'Done' as TaskStep, pend: false } : t));
  }, [tasks, update]);

  const rejectTask = useCallback((id: string) => {
    update(tasks.map(t => t.id === id ? { ...t, step: 'Reject' as TaskStep, pend: false } : t));
  }, [tasks, update]);

  const setPend = useCallback((id: string, pend: boolean) => {
    update(tasks.map(t => t.id === id ? { ...t, pend } : t));
  }, [tasks, update]);

  return createElement(TaskContext.Provider, { value: { tasks, addTask, updateTaskStep, approveTask, rejectTask, setPend } }, children);
}

export function useTaskStore() {
  return useContext(TaskContext);
}
