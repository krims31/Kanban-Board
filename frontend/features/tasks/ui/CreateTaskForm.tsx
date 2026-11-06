import { AlertCircle } from 'lucide-react'
import InputProject from '../../../shared/ui/input-project/inputProject'
import useCreateTask from '../hooks/useCreateTask'
import DueDate from './DueDate'
import PriorityController from './PriorityController'
export default function CreateTaskForm({ projectId }: { projectId: string }) {
  const { register, errors, serverError, handleSubmit, control } = useCreateTask(projectId)

  return (
    <form onSubmit={handleSubmit}>
      <InputProject
        registration={register('title')}
        label='Title'
        placeholder='Title'
        error={errors.title?.message}
      />

      {/* Project description */}
      <InputProject
        registration={register('description')}
        label='Project Description'
        placeholder='Project description will be here...'
        error={errors.description?.message}
      />

      <div className='grid grid-cols-2 gap-3'>
        <PriorityController control={control} error={errors.priority?.message} />
        <div className='flex flex-col gap-1'>
          <DueDate register={register} error={errors.dueDate?.message} />
        </div>
      </div>

      {serverError && (
        <span className='text-red-500 text-sm font-mono flex items-center gap-1'>
          <AlertCircle size={14} />
          {serverError}
        </span>
      )}

      <button type='submit'>
        <span className='relative top-5 text-sm font-mono border rounded-lg p-2 bg-black text-white outline-none ml-60 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition duration-300 transform ease-in-out cursor-pointer'>
          Create Task
        </span>
      </button>

      <button type='submit'>
        <span className='text-sm font-mono border border-gray-300 dark:border-zinc-700 rounded-lg p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-gray-300 outline-none ml-40 relative bottom-0 transition duration-200 cursor-pointer'>
          Cancel
        </span>
      </button>
    </form>
  )
}
