import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import CreateTaskForm from '../../tasks/ui/CreateTaskForm'

export default function CreateTaskButton() {
  const { id: projectId } = useParams<{ id: string }>()

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState<boolean>(false)

  if (!projectId) return null

  return (
    <>
      <Button
        onClick={() => setIsCreateTaskOpen(true)}
        className='flex items-center justify-center gap-2 dark:bg-sidebar-accent'
      >
        <Plus className='h-4 w-4 text-white' />
        <span className='dark:text-white'>Create Task</span>
      </Button>

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
    </>
  )
}
