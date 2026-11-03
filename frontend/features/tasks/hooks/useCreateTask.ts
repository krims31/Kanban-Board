import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createTasks } from '../api/task-api'
import { TaskFormValues, taskSchema } from '../schema/task.schema'

export default function useCreateTask(projectId: string) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: ''
    }
  })

  const queryClient = useQueryClient()

  const [serverError, setServerError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: TaskFormValues) => {
      return createTasks(projectId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    }
  })

  const onSubmit = (data: TaskFormValues) => {
    console.log('onSubmit called', data)
    mutation.mutate(data, {
      onError: error => {
        if (error instanceof Error) {
          setServerError(error.message)
        } else {
          setServerError('Something went wrong')
        }
      }
    })
  }

  return {
    register,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    serverError,
    control
  }
}
