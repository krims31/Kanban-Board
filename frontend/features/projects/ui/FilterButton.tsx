import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Check, Settings2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { PRIORITIES, PRIORITY_LABEL } from '../../tasks/constants/priority.const'
import { usePriorityFilter } from '../hooks/usePriorityFilter'

export default function FilterButton() {
  const { priority, setPriority } = usePriorityFilter()
  return (
    <main>
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
            <DropdownMenuItem key={p} onClick={() => setPriority(p)} className='cursor-pointer'>
              <span className='flex-1'>{PRIORITY_LABEL[p]}</span>
              {priority === p && <Check className='h-4 w-4' />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </main>
  )
}
