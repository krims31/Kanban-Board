import { UseFormRegister } from 'react-hook-form'
import { Input } from '../../../components/ui/input'
import { TaskFormValues } from '../schema/task.schema'

type Props = {
  register: UseFormRegister<TaskFormValues>
  error?: string
}

export default function DueDate({ register, error }: Props) {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-sm text-zinc-950 dark:text-slate-300'>Due date</label>
      <Input
        type='date'
        {...register('dueDate')}
        className='rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:text-white'
      />
      {error && <span className='text-xs text-red-500'>{error}</span>}
    </div>
  )
}
