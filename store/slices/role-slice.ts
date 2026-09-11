import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { http } from "@/lib/http"
import { normalizeError, type NormalizedApiError } from "@/lib/api-error"
import { type Role, mapRoleResponse } from "@/lib/role-data"
import type { ApiPage, RoleResponseDto } from "@/lib/api-types"

interface RoleState {
  items: Role[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: RoleState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
  size: 10,
  status: "idle",
  error: null,
}

// Roles are a fixed, backend-seeded reference set — list only, no create/update/delete.
export const fetchRoles = createAsyncThunk<ApiPage<RoleResponseDto>, { search?: string; page?: number; size?: number } | void, { rejectValue: NormalizedApiError }>(
  "roles/fetchRoles",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await http.get<ApiPage<RoleResponseDto>>("/roles", { params: params ?? undefined })
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    hydrateRoles(state, action: PayloadAction<ApiPage<RoleResponseDto>>) {
      state.items = action.payload.content.map(mapRoleResponse)
      state.totalElements = action.payload.totalElements
      state.totalPages = action.payload.totalPages
      state.page = action.payload.number
      state.size = action.payload.size
      state.status = "succeeded"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.content.map(mapRoleResponse)
        state.totalElements = action.payload.totalElements
        state.totalPages = action.payload.totalPages
        state.page = action.payload.number
        state.size = action.payload.size
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message ?? "Failed to load roles"
      })
  },
})

export const { hydrateRoles } = roleSlice.actions
export default roleSlice.reducer
