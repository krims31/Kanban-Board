import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Check, Plus, Settings2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import CalendarView from '../../../shared/ui/CalendarView/CalendarView'
import KanbanView from '../../../shared/ui/KanbanView/KanbanView'
import ListView from '../../../shared/ui/ListView/ListView'
import { PRIORITIES, PRIORITY_LABEL } from '../../tasks/constants/priority.const'
import CreateTaskForm from '../../tasks/ui/CreateTaskForm'
import { usePriorityFilter } from '../hooks/usePriorityFilter'
import CurrentProject from './CurrentProject'
import SearchBar from './SearchBar'
export default function ProjectToolbar() {
  const { id: projectId } = useParams<{ id: string }>()

  const { priority, setPriority } = usePriorityFilter()

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState<boolean>(false)

  if (!projectId) return null

  return (
    <main className='px-1 relative bottom-13'>
      {/* CurrentProject */}
      <CurrentProject />

      {/* Toolbar */}
      <section className='flex items-center justify-between mb-2'>
        <div className='flex gap-4'>
          <KanbanView />
          <ListView />
          <CalendarView />
        </div>

        <div className='flex items-center gap-3'>
          {/* Search bar */}
          <SearchBar />

          <div className='flex items-center gap-3 mt-10'>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant='outline' className='flex items-center gap-2'>
                    <Settings2 className='h-4 w-4 text-gray-400' />
                    <span>Filter{priority ? ' (1)' : ''}</span>
                  </Button>
                }
              />
              <DropdownMenuContent align='end' className='w-40'>
                <DropdownMenuItem onClick={() => setPriority(null)} className='cursor-pointer'>
                  <span className='flex-1'>All</span>
                  {!priority && <Check className='h-4 w-4' />}
                </DropdownMenuItem>
                {PRIORITIES.map(p => (
                  <DropdownMenuItem
                    key={p}
                    onClick={() => setPriority(p)}
                    className='cursor-pointer'
                  >
                    <span className='flex-1'>{PRIORITY_LABEL[p]}</span>
                    {priority === p && <Check className='h-4 w-4' />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setIsCreateTaskOpen(true)}
              className='flex items-center justify-center gap-2 dark:bg-sidebar-accent'
            >
              <Plus className='h-4 w-4 text-white' />
              <span className='dark:text-white'>Create Task</span>
            </Button>
          </div>
        </div>
      </section>
      {/* DialogTask that I could write a new task */}
      <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <CreateTaskForm
            projectId={projectId}
            onCancel={() => setIsCreateTaskOpen(false)}
            onSuccess={() => setIsCreateTaskOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Horizontal line */}
      <div className='h-px w-full bg-gray-300 mt-3' />
    </main>
  )
}
