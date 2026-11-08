import { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useCallback, useMemo } from 'react'
import { usePriorityFilter } from '../../projects/hooks/usePriorityFilter'
import { TaskStatus } from '../types/TaskType'
import useProjectId from './useProjectId'

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

export default function useDragEnd() {
  const {
    isPending,
    error,
    todoTasks,
    inProgressTasks,
    doneTasks,
    projectId,
    updateStatus,
    deleteTask,
    isActiveTask,
    setIsActiveTask,
    sensors,
    keyboardSensor,
    pointerSensor
  } = useProjectId()

  const { priority } = usePriorityFilter()

  // 1. All Tasks in the one array.
  const allTasks = useMemo(
    () => [...(todoTasks ?? []), ...(inProgressTasks ?? []), ...(doneTasks ?? [])],
    [todoTasks, inProgressTasks, doneTasks]
  )

  // 2. Filter by priority (null = all)
  const filtered = useMemo(
    () => (priority ? allTasks.filter(t => t.priority === priority) : allTasks),
    [allTasks, priority]
  )

  // 3. Splice filter by status - its return in the ProjectId
  const filteredTodo = useMemo(() => filtered.filter(t => t.status === 'TODO'), [filtered])
  const filteredInProgress = useMemo(
    () => filtered.filter(t => t.status === 'IN_PROGRESS'),
    [filtered]
  )
  const filteredDone = useMemo(() => filtered.filter(t => t.status === 'DONE'), [filtered])

  // 4. handleDragStart — find a task by id
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = String(event.active.id)
      const task = filtered.find(t => t.id === id) ?? null
      setIsActiveTask(task)
    },
    [filtered, setIsActiveTask]
  )

  const handleDragCancel = useCallback(() => setIsActiveTask(null), [setIsActiveTask])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setIsActiveTask(null)

      const { active, over } = event
      if (!over || active.id === over.id) return

      const overId = String(over.id)
      const targetStatus = statuses.includes(overId as TaskStatus)
        ? (overId as TaskStatus)
        : (over.data.current?.status as TaskStatus | undefined)

      if (!targetStatus) return

      const currentStatus = active.data.current?.status as TaskStatus | undefined
      if (currentStatus === targetStatus) return

      updateStatus(String(active.id), targetStatus)
    },
    [updateStatus, setIsActiveTask]
  )

  return {
    isActiveTask,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
    isPending,
    error,
    sensors,
    keyboardSensor,
    pointerSensor,
    todoTasks: filteredTodo,
    inProgressTasks: filteredInProgress,
    doneTasks: filteredDone,
    projectId,
    deleteTask
  }
}
