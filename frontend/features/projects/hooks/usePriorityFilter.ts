'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PRIORITIES, type TaskPriority } from '../../../features/tasks/constants/priority.const'

export function usePriorityFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const raw = searchParams.get('priority')
  const priority: TaskPriority | null =
    raw && (PRIORITIES as readonly string[]).includes(raw) ? (raw as TaskPriority) : null

  function setPriority(value: TaskPriority | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('priority', value)
    } else {
      params.delete('priority')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  return { priority, setPriority }
}
