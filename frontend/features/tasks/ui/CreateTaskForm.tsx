import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { Input } from '../../../components/ui/input'
import InputProject from '../../../shared/ui/input-project/inputProject'
import useCreateTask from '../hooks/useCreateTask'

export default function CreateTaskForm({ projectId }: { projectId: string }) {
  const { register, errors, serverError, handleSubmit, control } = useCreateTask(projectId)

  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputProject
          registration={register('title')}
          label='Title'
          placeholder='Title'
          error={errors.title?.message}
        />

        <InputProject
          registration={register('description')}
          label='Project Description'
          placeholder='Project description will be here...'
          error={errors.description?.message}
        />

        <div className='grid grid-cols-2 gap-3'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-zinc-950 dark:text-slate-300'>Priority</label>
            <Controller
              name='priority'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Priority' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='LOW'>Low</SelectItem>
                    <SelectItem value='MEDIUM'>Medium</SelectItem>
                    <SelectItem value='HIGH'>High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority?.message && (
              <span className='text-xs text-red-500'>{errors.priority.message}</span>
            )}
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-zinc-950 dark:text-slate-300'>Due date</label>
            <Input
              type='date'
              {...register('dueDate')}
              className='rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:text-white'
            />
            {errors.dueDate?.message && (
              <span className='text-xs text-red-500'>{errors.dueDate.message}</span>
            )}
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
    </>
  )
}
