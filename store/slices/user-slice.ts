import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { http } from "@/lib/http"
import { normalizeError, type NormalizedApiError } from "@/lib/api-error"
import { type User, mapUserResponse } from "@/lib/user-data"
import type { ApiPage, UserRequestDto, UserResponseDto } from "@/lib/api-types"

interface UserState {
  items: User[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  mutating: boolean
}

const initialState: UserState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
  size: 10,
  status: "idle",
  error: null,
  mutating: false,
}

export const fetchUsers = createAsyncThunk<ApiPage<UserResponseDto>, { search?: string; status?: string; page?: number; size?: number } | void, { rejectValue: NormalizedApiError }>(
  "users/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await http.get<ApiPage<UserResponseDto>>("/users", {
        params: params ? { ...params, status: params.status?.toUpperCase() } : undefined,
      })
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const createUser = createAsyncThunk<UserResponseDto, UserRequestDto, { rejectValue: NormalizedApiError }>(
  "users/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await http.post<UserResponseDto>("/users", payload)
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const updateUser = createAsyncThunk<UserResponseDto, { id: string; payload: UserRequestDto }, { rejectValue: NormalizedApiError }>(
  "users/updateUser",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await http.put<UserResponseDto>(`/users/${id}`, payload)
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const deleteUser = createAsyncThunk<string, string, { rejectValue: NormalizedApiError }>(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/users/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    hydrateUsers(state, action: PayloadAction<ApiPage<UserResponseDto>>) {
      state.items = action.payload.content.map(mapUserResponse)
      state.totalElements = action.payload.totalElements
      state.totalPages = action.payload.totalPages
      state.page = action.payload.number
      state.size = action.payload.size
      state.status = "succeeded"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.content.map(mapUserResponse)
        state.totalElements = action.payload.totalElements
        state.totalPages = action.payload.totalPages
        state.page = action.payload.number
        state.size = action.payload.size
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message ?? "Failed to load users"
      })
      // Table is refreshed from the server after a successful submit (see users-page-client.tsx),
      // so no optimistic list update is needed here.
      .addCase(createUser.pending, (state) => {
        state.mutating = true
      })
      .addCase(createUser.fulfilled, (state) => {
        state.mutating = false
      })
      .addCase(createUser.rejected, (state) => {
        state.mutating = false
      })
      .addCase(updateUser.pending, (state) => {
        state.mutating = true
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.mutating = false
      })
      .addCase(updateUser.rejected, (state) => {
        state.mutating = false
      })
      .addCase(deleteUser.pending, (state) => {
        state.mutating = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.mutating = false
        state.items = state.items.filter((u) => u.id !== action.payload)
        state.totalElements -= 1
      })
      .addCase(deleteUser.rejected, (state) => {
        state.mutating = false
      })
  },
})

export const { hydrateUsers } = userSlice.actions
export default userSlice.reducer
