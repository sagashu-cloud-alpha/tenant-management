import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { http } from "@/lib/http"
import { normalizeError, type NormalizedApiError } from "@/lib/api-error"
import { type Tenant, mapTenantResponse } from "@/lib/tenant-data"
import type { ApiPage, TenantRequestDto, TenantResponseDto } from "@/lib/api-types"

interface TenantState {
  items: Tenant[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  mutating: boolean
}

const initialState: TenantState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
  size: 10,
  status: "idle",
  error: null,
  mutating: false,
}

export const fetchTenants = createAsyncThunk<ApiPage<TenantResponseDto>, { search?: string; status?: string; page?: number; size?: number } | void, { rejectValue: NormalizedApiError }>(
  "tenants/fetchTenants",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await http.get<ApiPage<TenantResponseDto>>("/tenants", {
        params: params ? { ...params, status: params.status?.toUpperCase() } : undefined,
      })
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const createTenant = createAsyncThunk<TenantResponseDto, TenantRequestDto, { rejectValue: NormalizedApiError }>(
  "tenants/createTenant",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await http.post<TenantResponseDto>("/tenants", payload)
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const updateTenant = createAsyncThunk<TenantResponseDto, { id: string; payload: TenantRequestDto }, { rejectValue: NormalizedApiError }>(
  "tenants/updateTenant",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await http.put<TenantResponseDto>(`/tenants/${id}`, payload)
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

const tenantSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {
    hydrateTenants(state, action: PayloadAction<ApiPage<TenantResponseDto>>) {
      state.items = action.payload.content.map(mapTenantResponse)
      state.totalElements = action.payload.totalElements
      state.totalPages = action.payload.totalPages
      state.page = action.payload.number
      state.size = action.payload.size
      state.status = "succeeded"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.content.map(mapTenantResponse)
        state.totalElements = action.payload.totalElements
        state.totalPages = action.payload.totalPages
        state.page = action.payload.number
        state.size = action.payload.size
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message ?? "Failed to load tenants"
      })
      .addCase(createTenant.pending, (state) => {
        state.mutating = true
      })
      // Table is refreshed from the server after a successful submit (see tenants-page-client.tsx),
      // so no optimistic list update is needed here.
      .addCase(createTenant.fulfilled, (state) => {
        state.mutating = false
      })
      .addCase(createTenant.rejected, (state) => {
        state.mutating = false
      })
      .addCase(updateTenant.pending, (state) => {
        state.mutating = true
      })
      .addCase(updateTenant.fulfilled, (state) => {
        state.mutating = false
      })
      .addCase(updateTenant.rejected, (state) => {
        state.mutating = false
      })
  },
})

export const { hydrateTenants } = tenantSlice.actions
export default tenantSlice.reducer
