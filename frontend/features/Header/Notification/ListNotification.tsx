import { Inbox } from 'lucide-react'
import { NotificationItem } from './interface/NotificationItem'

interface Props {
  notifications: NotificationItem[]
  onRead: (id: number) => void
}

export default function ListNotification({ notifications, onRead }: Props) {
  return (
    <>
      <ul className='max-h-80 overflow-y-auto'>
        {notifications.length === 0 && (
          <li className='flex flex-col items-center gap-2 px-4 py-8 text-sm text-slate-800 font-mono'>
            <Inbox className='h-6 w-6 text-slate-800 font-mono dark:text-white' />
            No notifications
          </li>
        )}

        {notifications.map(n => (
          <li
            key={n.id}
            onClick={() => onRead(n.id)}
            className={`cursor-pointer border-b px-4 py-3 text-sm last:border-b-0 hover:bg-gray-50 dark:bg-black ${
              n.read ? 'opacity-60' : 'bg-sky-50/40'
            }`}
          >
            <div className='flex items-start gap-2'>
              {!n.read && <span className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500' />}
              <div className='flex-1'>
                <p className='font-medium dark:text-white'>{n.title}</p>
                {n.description && (
                  <p className='text-xs text-gray-500 dark:text-white'>{n.description}</p>
                )}
                <p className='mt-1 text-[11px] text-gray-400 dark:text-white'>{n.createdAt}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
