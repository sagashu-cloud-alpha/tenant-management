// Shared Auth0 SDK client; reads AUTH0_* env vars, used by proxy.ts and Server Components.
import { Auth0Client } from "@auth0/nextjs-auth0/server"

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: "openid profile email offline_access",
  },
})
