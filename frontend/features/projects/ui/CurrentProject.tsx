import Image from 'next/image'
import { useParams } from 'next/navigation'
import useProject from '../hooks/useProject'

export default function CurrentProject() {
  const params = useParams()
  const { project: projects } = useProject()

  const projectId = params.id as string | undefined

  const currentProject = projects?.find(project => project.id === projectId)

  return (
    <div className='flex items-center gap-3 mb-2'>
      <Image
        priority={true}
        src='/taskflow.png'
        width={40}
        height={40}
        className='rounded'
        alt='Project icon'
        unoptimized
      />
      <h1 className='text-2xl text-slate-800 drop-shadow-sm dark:text-white'>
        {currentProject?.title}
      </h1>
    </div>
  )
}
