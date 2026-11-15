import { NotificationItem } from '../Notification/interface/NotificationItem'

export const NotificationInitial = () => {
  const initial: NotificationItem[] = [
    {
      id: 1,
      title: 'New task assigned',
      description: 'Fix login bug',
      createdAt: '2m ago',
      read: false
    },
    {
      id: 2,
      title: 'Comment on your task',
      description: 'Looks good!',
      createdAt: '1h ago',
      read: false
    },
    {
      id: 3,
      title: 'Project updated',
      description: 'Design v2',
      createdAt: 'yesterday',
      read: true
    }
  ]

  return {
    initial
  }
}
