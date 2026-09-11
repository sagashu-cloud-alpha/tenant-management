import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { http } from "@/lib/http"
import { normalizeError, type NormalizedApiError } from "@/lib/api-error"
import { type Plan, mapPlanResponse } from "@/lib/plan-data"
import type { ApiPage, PlanRequestDto, PlanResponseDto } from "@/lib/api-types"

interface PlanState {
  items: Plan[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  mutating: boolean
}

const initialState: PlanState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
  size: 10,
  status: "idle",
  error: null,
  mutating: false,
}

export const fetchPlans = createAsyncThunk<ApiPage<PlanResponseDto>, { search?: string; page?: number; size?: number } | void, { rejectValue: NormalizedApiError }>(
  "plans/fetchPlans",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await http.get<ApiPage<PlanResponseDto>>("/plans", { params: params ?? undefined })
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const createPlan = createAsyncThunk<PlanResponseDto, PlanRequestDto, { rejectValue: NormalizedApiError }>(
  "plans/createPlan",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await http.post<PlanResponseDto>("/plans", payload)
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const updatePlan = createAsyncThunk<PlanResponseDto, { id: string; payload: PlanRequestDto }, { rejectValue: NormalizedApiError }>(
  "plans/updatePlan",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await http.put<PlanResponseDto>(`/plans/${id}`, payload)
      return data
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

export const deletePlan = createAsyncThunk<string, string, { rejectValue: NormalizedApiError }>(
  "plans/deletePlan",
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/plans/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(normalizeError(err))
    }
  },
)

const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    hydratePlans(state, action: PayloadAction<ApiPage<PlanResponseDto>>) {
      state.items = action.payload.content.map(mapPlanResponse)
      state.totalElements = action.payload.totalElements
      state.totalPages = action.payload.totalPages
      state.page = action.payload.number
      state.size = action.payload.size
      state.status = "succeeded"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.content.map(mapPlanResponse)
        state.totalElements = action.payload.totalElements
        state.totalPages = action.payload.totalPages
        state.page = action.payload.number
        state.size = action.payload.size
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message ?? "Failed to load plans"
      })
      // Table is refreshed from the server after a successful submit (see plan-panel.tsx),
      // so no optimistic list update is needed here.
      .addCase(createPlan.pending, (state) => {
        state.mutating = true
      })
      .addCase(createPlan.fulfilled, (state) => {
        state.mutating = false
      })
      .addCase(createPlan.rejected, (state) => {
        state.mutating = false
      })
      .addCase(updatePlan.pending, (state) => {
        state.mutating = true
      })
      .addCase(updatePlan.fulfilled, (state) => {
        state.mutating = false
      })
      .addCase(updatePlan.rejected, (state) => {
        state.mutating = false
      })
      .addCase(deletePlan.pending, (state) => {
        state.mutating = true
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.mutating = false
        state.items = state.items.filter((p) => p.id !== action.payload)
        state.totalElements -= 1
      })
      .addCase(deletePlan.rejected, (state) => {
        state.mutating = false
      })
  },
})

export const { hydratePlans } = planSlice.actions
export default planSlice.reducer
