// Normalized shape every API failure is converted into, regardless of whether it
// came from the backend's ApiError JSON body, a network failure, or a timeout.
export interface NormalizedApiError {
  status: number
  message: string
  fieldErrors?: Record<string, string>
}

interface BackendApiError {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  path?: string
  errors?: Record<string, string>
}

export function normalizeError(err: unknown): NormalizedApiError {
  if (isAxiosLikeError(err)) {
    const response = err.response
    if (response) {
      const body = response.data as BackendApiError | undefined
      return {
        status: response.status,
        message: body?.message || "Something went wrong. Please try again.",
        fieldErrors: body?.errors,
      }
    }
    return { status: 0, message: "Unable to reach the server. Check your connection and try again." }
  }
  if (err instanceof Error) {
    return { status: 0, message: err.message }
  }
  return { status: 0, message: "Something went wrong. Please try again." }
}

function isAxiosLikeError(err: unknown): err is { response?: { status: number; data: unknown } } {
  return typeof err === "object" && err !== null && "isAxiosError" in err
}
