// Single shared axios instance for all client-side (browser) API calls.
// Server Components should use `lib/server-fetch.ts` instead — see that file for why.
//
// Points at app/api/backend/[...path]/route.ts (same-origin), not Spring Boot
// directly — that route attaches the Auth0 access token server-side, so it
// never has to reach browser JS.
import axios from "axios"

export const http = axios.create({
  baseURL: "/api/backend",
  headers: {
    "Content-Type": "application/json",
  },
})

http.interceptors.request.use((config) => config)

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
