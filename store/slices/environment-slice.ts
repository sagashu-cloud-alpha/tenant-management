import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { http } from "@/lib/http"
import { normalizeError, type NormalizedApiError } from "@/lib/api-error"
import { type Environment, mapEnvironmentResponse } from "@/lib/environment-data"
import type { ApiPage, EnvironmentRequestDto, EnvironmentResponseDto } from "@/lib/api-types"

interface EnvironmentState {
  items: Environment[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  mutating: boolean
}

const initialState: EnvironmentState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
  size: 10,
  status: "idle",
  error: null,
  mutating: false,
}

export const fetchEnvironments = createAsyncThunk<ApiPage<EnvironmentResponseDto>, { search?: string; page?: number; size?: number } | void, { rejectValue: NormalizedApiError }>(
  "environments/fetchEnvironments",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await http.get<ApiPage<EnvironmentResponseDto>>("/environments", { params: params ?? undefined })
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const createEnvironment = createAsyncThunk<EnvironmentResponseDto, EnvironmentRequestDto, { rejectValue: NormalizedApiError }>(
  "environments/createEnvironment",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await http.post<EnvironmentResponseDto>("/environments", payload)
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const updateEnvironment = createAsyncThunk<EnvironmentResponseDto, { id: string; payload: EnvironmentRequestDto }, { rejectValue: NormalizedApiError }>(
  "environments/updateEnvironment",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await http.put<EnvironmentResponseDto>(`/environments/${id}`, payload)
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const deleteEnvironment = createAsyncThunk<string, string, { rejectValue: NormalizedApiError }>(
  "environments/deleteEnvironment",
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/environments/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

const environmentSlice = createSlice({
  name: "environments",
  initialState,
  reducers: {
    hydrateEnvironments(state, action: PayloadAction<ApiPage<EnvironmentResponseDto>>) {
      state.items = action.payload.content.map(mapEnvironmentResponse)
      state.totalElements = action.payload.totalElements
      state.totalPages = action.payload.totalPages
      state.page = action.payload.number
      state.size = action.payload.size
      state.status = "succeeded"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnvironments.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchEnvironments.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.content.map(mapEnvironmentResponse)
        state.totalElements = action.payload.totalElements
        state.totalPages = action.payload.totalPages
        state.page = action.payload.number
        state.size = action.payload.size
      })
      .addCase(fetchEnvironments.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message ?? "Failed to load environments"
      })
      // Table is refreshed from the server after a successful submit (see environment-panel.tsx),
      // so no optimistic list update is needed here.
      .addCase(createEnvironment.pending, (state) => {
        state.mutating = true
      })
      .addCase(createEnvironment.fulfilled, (state) => {
        state.mutating = false
      })
      .addCase(createEnvironment.rejected, (state) => {
        state.mutating = false
      })
      .addCase(updateEnvironment.pending, (state) => {
        state.mutating = true
      })
      .addCase(updateEnvironment.fulfilled, (state) => {
        state.mutating = false
      })
      .addCase(updateEnvironment.rejected, (state) => {
        state.mutating = false
      })
      .addCase(deleteEnvironment.pending, (state) => {
        state.mutating = true
      })
      .addCase(deleteEnvironment.fulfilled, (state, action) => {
        state.mutating = false
        state.items = state.items.filter((e) => e.id !== action.payload)
        state.totalElements -= 1
      })
      .addCase(deleteEnvironment.rejected, (state) => {
        state.mutating = false
      })
  },
})

export const { hydrateEnvironments } = environmentSlice.actions
export default environmentSlice.reducer
