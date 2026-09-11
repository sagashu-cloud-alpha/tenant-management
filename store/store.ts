import { combineReducers, configureStore } from "@reduxjs/toolkit"
import tenantReducer from "@/store/slices/tenant-slice"
import userReducer from "@/store/slices/user-slice"
import roleReducer from "@/store/slices/role-slice"
import planReducer from "@/store/slices/plan-slice"
import billingCycleReducer from "@/store/slices/billing-cycle-slice"
import environmentReducer from "@/store/slices/environment-slice"

const rootReducer = combineReducers({
  tenants: tenantReducer,
  users: userReducer,
  roles: roleReducer,
  plans: planReducer,
  billingCycles: billingCycleReducer,
  environments: environmentReducer,
})

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type IRootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore["dispatch"]
