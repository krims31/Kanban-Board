import { Command, Search } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import useInputKeydown from '../hooks/useInputKeydown'

export default function SearchBar() {
  const { searchRef } = useInputKeydown()

  return (
    <div className='relative w-64 mt-10'>
      <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
      <Input ref={searchRef} placeholder='Search' className='pl-9 pr-14' />
      <kbd className='pointer-events-none absolute right-3 top-1/2 inline-flex -translate-y-1/2 select-none items-center gap-0.5 rounded-md border bg-muted px-1.5 py-0.5 font-sans text-[11px] font-medium text-muted-foreground shadow-sm'>
        <Command size={11} strokeWidth={2.25} />
        <span>K</span>
      </kbd>
    </div>
  )
}
