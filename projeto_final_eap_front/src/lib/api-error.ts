import axios from 'axios'

type ErrorResponse = {
  message?: string
  error?: string
  statusCode?: number
  [key: string]: unknown
}

export const extractApiErrorMessage = (error: unknown, fallback = 'Ocorreu um erro inesperado.') => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse | string | undefined

    if (typeof data === 'string' && data.trim().length > 0) {
      return data
    }

    if (data && typeof data === 'object') {
      if (typeof data.message === 'string' && data.message.trim().length > 0) {
        return data.message
      }

      if (typeof data.error === 'string' && data.error.trim().length > 0) {
        return data.error
      }
    }
  }

  if (error instanceof Error && typeof error.message === 'string' && error.message.trim().length > 0) {
    return error.message
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  return fallback
}
