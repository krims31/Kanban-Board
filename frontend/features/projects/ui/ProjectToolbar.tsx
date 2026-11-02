import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Command, Plus, Search, Settings2 } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import CalendarView from '../../../shared/ui/CalendarView/CalendarView'
import KanbanView from '../../../shared/ui/KanbanView/KanbanView'
import ListView from '../../../shared/ui/ListView/ListView'
import CreateTaskForm from '../../tasks/ui/CreateTaskForm'
import useInputKeydown from '../hooks/useInputKeydown'
import useProject from '../hooks/useProject'

export default function ProjectToolbar() {
  const params = useParams()
  const { searchRef } = useInputKeydown()

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState<boolean>(false)

  const { project: projects } = useProject()

  // Get the current project ID from the URL params
  const projectId = params.id as string | undefined

  const currentProject = projects?.find(project => project.id === projectId)

  return (
    <main className='px-1 relative bottom-13'>
      <div className='flex items-center gap-3 mb-2'>
        <Image
          priority={true}
          src='/taskflow.png'
          width={40}
          height={40}
          className='rounded'
          alt='Project icon'
        />
        <h1 className='text-2xl text-slate-800 drop-shadow-sm dark:text-white'>
          {currentProject?.title}
        </h1>
      </div>

      {/* Toolbar */}
      <div className='flex items-center justify-between mb-2'>
        <div className='flex gap-4'>
          <KanbanView />
          <ListView />
          <CalendarView />
        </div>

        <div className='flex items-center gap-3'>
          {/* Search bar */}
          <div className='relative w-64 mt-10'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input ref={searchRef} placeholder='Search' className='pl-9 pr-14' />
            <kbd className='pointer-events-none absolute right-3 top-1/2 inline-flex -translate-y-1/2 select-none items-center gap-0.5 rounded-md border bg-muted px-1.5 py-0.5 font-sans text-[11px] font-medium text-muted-foreground shadow-sm'>
              <Command size={11} strokeWidth={2.25} />
              <span>K</span>
            </kbd>
          </div>

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
              <CreateTaskForm projectId={projectId as string} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Horizontal line */}
      <div className='h-px w-full bg-gray-300 mt-3' />
    </main>
  )
}
