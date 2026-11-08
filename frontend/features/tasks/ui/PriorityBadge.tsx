import { Flag } from 'lucide-react'
import { PRIORITY_LABEL, PRIORITY_STYLES, TaskPriority } from '../constants/priority.const'

export default function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLES[priority]}`}
    >
      <Flag size={10} />
      {PRIORITY_LABEL[priority]}
    </span>
  )
}
