import { TaskPriority } from '../constants/priority.const'

export type Task = {
  id: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string | null
  status: TaskStatus
  projectId: string
  createdAt: string
}

export const taskStatuses = ['TODO', 'IN_PROGRESS', 'DONE'] as const

export type TaskStatus = (typeof taskStatuses)[number]

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; dot: string; badge: string; header: string; text: string; count: string }
> = {
  TODO: {
    label: 'To Do',
    dot: 'bg-sky-500',
    badge:
      'bg-sky-50 text-blue-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900',
    header: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    count: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dot: 'bg-amber-500',
    badge:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    header: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    count: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
  },
  DONE: {
    label: 'Done',
    dot: 'bg-emerald-500',
    badge:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
    header: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    count: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
  }
}
