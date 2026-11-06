import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Control, Controller } from 'react-hook-form'
import { TaskFormValues } from '../schema/task.schema'

type Props = {
  control: Control<TaskFormValues>
  error?: string
}

export default function PriorityController({ control, error }: Props) {
  return (
    <>
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
        {error && <span className='text-xs text-red-500'>{error}</span>}
      </div>
    </>
  )
}
