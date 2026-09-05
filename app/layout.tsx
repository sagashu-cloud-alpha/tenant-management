import { Outfit } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { OrgSettingsProvider } from "@/components/org-settings-provider"
import { ProfileProvider } from "@/components/profile-provider"
import { cn } from "@/lib/utils"

// app/layout.tsx  (or pages/_document.tsx for Pages Router)

export const metadata = {
  title: "Cloud Alpha",
  description: "Multi-cloud management platform",
  icons: {
    icon: [
      {
        url: `data:image/svg+xml,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#2878E5"/>
            <text
              x="16" y="22"
              font-family="Outfit, system-ui, sans-serif"
              font-size="13"
              font-weight="700"
              fill="white"
              text-anchor="middle"
              letter-spacing="-0.5"
            >CA</text>
          </svg>
        `)}`,
        type: "image/svg+xml",
      },
    ],
  },
}

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", outfit.variable)}
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
      </head>
      <body>
        <ThemeProvider>
          <OrgSettingsProvider>
            <ProfileProvider>
              {children}
            </ProfileProvider>
          </OrgSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

