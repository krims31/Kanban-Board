'use client'
import { useState } from 'react'
import { NotificationItem } from '../Notification/interface/NotificationItem'
import { NotificationInitial } from '../constansts/notification.const'

export default function useNotifications() {
  const { initial } = NotificationInitial()
  const [notifications, setNotifications] = useState<NotificationItem[]>(initial)
  const [isOpenNotification, setIsOpenNotification] = useState<boolean>(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))

  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  return {
    notifications,
    isOpenNotification,
    setIsOpenNotification,
    unreadCount,
    markAsRead,
    markAllAsRead
  }
}
