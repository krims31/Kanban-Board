export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const
export type TaskPriority = (typeof PRIORITIES)[number]

export const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short'
  })
}

export const PRIORITY_STYLES: Record<TaskPriority, string> = {
  LOW: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  HIGH: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400'
}

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
}
