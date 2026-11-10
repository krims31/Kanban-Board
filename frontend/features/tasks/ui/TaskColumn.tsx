import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { memo } from 'react'
import { TaskColumnProps } from '../interfaces/TaskColumnProps'
import type { TaskStatus } from '../types/TaskType'
import { STATUS_CONFIG } from '../types/TaskType'
import TaskItem from './TaskItem'

interface ExtendedTaskColumnProps extends TaskColumnProps {
  onDeleteTask: (id: string) => void
}

function TaskColumn({
  projectId,
  status,
  tasks = [],
  onAdd,
  onDeleteTask
}: ExtendedTaskColumnProps) {
  const config = STATUS_CONFIG[status as TaskStatus]

  const { setNodeRef, isOver } = useDroppable({ id: status })

  if (!config) return null

  console.log('TaskColumn render:', status)

  return (
    <div
      ref={setNodeRef}
      className={`flex w-80
       dark:bg-gray-500/30 shrink-0 flex-col gap-3 rounded-xl bg-slate-100 p-3 transition ${
         isOver ? 'ring-2 ring-sky-400 bg-sky-50/60' : ''
       }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-10 flex items-center justify-between rounded-lg px-3 py-2 ${config.header}`}
      >
        <div className='flex items-center gap-2'>
          <span className={`h-2 w-2 rounded-full ${config.dot}`} />
          <h2 className={`text-sm font-medium ${config.text}`}>{config.label}</h2>
          <span className={`rounded-full px-2 text-xs font-semibold ${config.count}`}>
            {tasks.length}
          </span>
        </div>
        <button
          type='button'
          onClick={onAdd}
          aria-label={`Add task to ${config.label}`}
          className='rounded p-1 text-gray-500 transition hover:bg-white/60 hover:text-gray-800'
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Task list */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <ul className='flex min-h-80 flex-1 flex-col gap-2'>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} projectId={projectId} onDelete={onDeleteTask} />
          ))}

          {/* Empty state / hint by moved */}
          {tasks.length === 0 && (
            <li
              className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center text-xs transition ${
                isOver ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-300 text-slate-400'
              }`}
            >
              <Plus size={20} className={isOver ? 'text-sky-500' : 'text-slate-300'} />
              <span>{isOver ? 'Drop here' : 'Move a task here'}</span>
            </li>
          )}

          {tasks.length > 0 && isOver && (
            <li className='h-1 rounded-full bg-sky-400/70' aria-hidden />
          )}
        </ul>
      </SortableContext>
    </div>
  )
}

export default memo(TaskColumn)
