import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import CalendarView from '../../../shared/ui/CalendarView/CalendarView'
import KanbanView from '../../../shared/ui/KanbanView/KanbanView'
import ListView from '../../../shared/ui/ListView/ListView'
import CreateTaskForm from '../../tasks/ui/CreateTaskForm'
import CurrentProject from './CurrentProject'
import FilterButton from './FilterButton'
import SearchBar from './SearchBar'
export default function ProjectToolbar() {
  const { id: projectId } = useParams<{ id: string }>()

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
            {/* Filter Button */}
            <FilterButton />

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
