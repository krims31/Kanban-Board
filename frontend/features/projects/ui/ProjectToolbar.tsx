import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Settings2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import CalendarView from '../../../shared/ui/CalendarView/CalendarView'
import KanbanView from '../../../shared/ui/KanbanView/KanbanView'
import ListView from '../../../shared/ui/ListView/ListView'
import CreateTaskForm from '../../tasks/ui/CreateTaskForm'
import CurrentProject from './CurrentProject'
import SearchBar from './SearchBar'
export default function ProjectToolbar() {
  const params = useParams()

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState<boolean>(false)

  // Get the current project ID from the URL params
  const projectId = params.id as string | undefined

  return (
    <main className='px-1 relative bottom-13'>
      {/* CurrentProject */}
      <CurrentProject />

      {/* Toolbar */}
      <div className='flex items-center justify-between mb-2'>
        <div className='flex gap-4'>
          <KanbanView />
          <ListView />
          <CalendarView />
        </div>

        <div className='flex items-center gap-3'>
          {/* Search bar */}
          <SearchBar />

          <div className='mt-10'>
            <Button variant='outline' className='flex items-center gap-2'>
              <Settings2 className='h-4 w-4 text-gray-400' />
              <span>Filter</span>
            </Button>
          </div>

          {/* Open DialogTask that I could write a new task */}
          <div className='mt-10'>
            <Button
              onClick={() => setIsTaskDialogOpen(true)}
              className='flex items-center justify-center gap-2 dark:bg-sidebar-accent'
            >
              <Plus className='h-4 w-4 text-white' />
              <span className='dark:text-white'>Create Task</span>
            </Button>
          </div>

          {/* DialogTask that I could write a new task */}
          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Task</DialogTitle>
              </DialogHeader>
              <CreateTaskForm
                projectId={projectId as string}
                onCancel={() => setIsTaskDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Horizontal line */}
      <div className='h-px w-full bg-gray-300 mt-3' />
    </main>
  )
}
