import { useParams } from 'next/navigation'
import CalendarView from '../../../shared/ui/CalendarView/CalendarView'
import KanbanView from '../../../shared/ui/KanbanView/KanbanView'
import ListView from '../../../shared/ui/ListView/ListView'
import CreateTaskButton from './CreateTaskButton'
import CurrentProject from './CurrentProject'
import FilterButton from './FilterButton'
import SearchBar from './SearchBar'
export default function ProjectToolbar() {
  const { id: projectId } = useParams<{ id: string }>()

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

            {/* Create Task Button */}
            <CreateTaskButton />
          </div>
        </div>
      </section>

      {/* Horizontal line */}
      <div className='h-px w-full bg-gray-300 mt-3' />
    </main>
  )
}
