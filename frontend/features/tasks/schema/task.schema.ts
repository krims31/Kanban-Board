import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().max(2000).optional().or(z.literal('')),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(value => !value || !isNaN(Date.parse(value)), 'Invalid Date')
})

export type TaskFormValues = z.infer<typeof taskSchema>
