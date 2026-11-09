'use client'

import { CheckCheck } from 'lucide-react'
import { NotificationItem } from './interface/NotificationItem'
import ListNotification from './ListNotification'
interface Props {
  notifications: NotificationItem[]
  unreadCount: number
  onRead: (id: number) => void
  onReadAll: () => void
  onClose: () => void
}

export default function NotificationsPanel({
  unreadCount,
  onReadAll,
  onClose,
  notifications,
  onRead
}: Props) {
  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between border-b px-4 py-3'>
        <div className='flex items-center gap-2'>
          <h3 className='text-sm text-slate-800 font-mono dark:text-white'>Notifications</h3>
          {unreadCount > 0 && (
            <span className='rounded-full bg-red-100 px-2 text-xs text-red-600'>{unreadCount}</span>
          )}
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <button
            onClick={onReadAll}
            className='flex items-center gap-1 text-xs text-slate-800 font-mono hover:text-gray-900 dark:text-white'
          >
            <CheckCheck className='h-3.5 w-3.5 text-slate-800 font-mono dark:text-white' />
            Mark all read
          </button>
        )}
      </div>

      {/* List of notifications */}
      <ListNotification notifications={notifications} onRead={onRead} />

      {/* Close button */}
      <div className='border-t px-4 py-2 text-center'>
        <button
          onClick={onClose}
          className='text-xs text-slate-800 font-mono hover:text-gray-900 dark:text-white'
        >
          Close
        </button>
      </div>
    </div>
  )
}
