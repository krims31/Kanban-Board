import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ApiClient from '../../../shared/api/api-client'
import { RegisterFormValues, registerSchema } from './register.schema'

export default function useAuthRegister() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  })

  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await ApiClient('/auth/register', {
        method: 'POST',
        auth: false,
        body: data
      })

      router.push('/auth/login')
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message)
      } else {
        setServerError('Something went wrong')
      }
    }
  }

  return { register, handleSubmit: handleSubmit(onSubmit), errors, serverError }
}
