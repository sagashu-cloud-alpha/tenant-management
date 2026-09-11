import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { http } from "@/lib/http"
import { normalizeError, type NormalizedApiError } from "@/lib/api-error"
import { type BillingCycle, mapBillingCycleResponse } from "@/lib/billing-cycle-data"
import type { ApiPage, BillingCycleRequestDto, BillingCycleResponseDto } from "@/lib/api-types"

interface BillingCycleState {
  items: BillingCycle[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  mutating: boolean
}

const initialState: BillingCycleState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
  size: 10,
  status: "idle",
  error: null,
  mutating: false,
}

export const fetchBillingCycles = createAsyncThunk<ApiPage<BillingCycleResponseDto>, { search?: string; page?: number; size?: number } | void, { rejectValue: NormalizedApiError }>(
  "billingCycles/fetchBillingCycles",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await http.get<ApiPage<BillingCycleResponseDto>>("/billing-cycles", { params: params ?? undefined })
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const createBillingCycle = createAsyncThunk<BillingCycleResponseDto, BillingCycleRequestDto, { rejectValue: NormalizedApiError }>(
  "billingCycles/createBillingCycle",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await http.post<BillingCycleResponseDto>("/billing-cycles", payload)
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const updateBillingCycle = createAsyncThunk<BillingCycleResponseDto, { id: string; payload: BillingCycleRequestDto }, { rejectValue: NormalizedApiError }>(
  "billingCycles/updateBillingCycle",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await http.put<BillingCycleResponseDto>(`/billing-cycles/${id}`, payload)
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const deleteBillingCycle = createAsyncThunk<string, string, { rejectValue: NormalizedApiError }>(
  "billingCycles/deleteBillingCycle",
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/billing-cycles/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

const billingCycleSlice = createSlice({
  name: "billingCycles",
  initialState,
  reducers: {
    hydrateBillingCycles(state, action: PayloadAction<ApiPage<BillingCycleResponseDto>>) {
      state.items = action.payload.content.map(mapBillingCycleResponse)
      state.totalElements = action.payload.totalElements
      state.totalPages = action.payload.totalPages
      state.page = action.payload.number
      state.size = action.payload.size
      state.status = "succeeded"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingCycles.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchBillingCycles.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.content.map(mapBillingCycleResponse)
        state.totalElements = action.payload.totalElements
        state.totalPages = action.payload.totalPages
        state.page = action.payload.number
        state.size = action.payload.size
      })
      .addCase(fetchBillingCycles.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message ?? "Failed to load billing cycles"
      })
      // Table is refreshed from the server after a successful submit (see billing-cycle-panel.tsx),
      // so no optimistic list update is needed here.
      .addCase(createBillingCycle.pending, (state) => {
        state.mutating = true
      })
      .addCase(createBillingCycle.fulfilled, (state) => {
        state.mutating = false
      })
      .addCase(createBillingCycle.rejected, (state) => {
        state.mutating = false
      })
      .addCase(updateBillingCycle.pending, (state) => {
        state.mutating = true
      })
      .addCase(updateBillingCycle.fulfilled, (state) => {
        state.mutating = false
      })
      .addCase(updateBillingCycle.rejected, (state) => {
        state.mutating = false
      })
      .addCase(deleteBillingCycle.pending, (state) => {
        state.mutating = true
      })
      .addCase(deleteBillingCycle.fulfilled, (state, action) => {
        state.mutating = false
        state.items = state.items.filter((b) => b.id !== action.payload)
        state.totalElements -= 1
      })
      .addCase(deleteBillingCycle.rejected, (state) => {
        state.mutating = false
      })
  },
})

export const { hydrateBillingCycles } = billingCycleSlice.actions
export default billingCycleSlice.reducer
