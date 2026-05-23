import { Inter, DM_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { AppLayout } from "@/components/app-layout"

// app/layout.tsx  (or pages/_document.tsx for Pages Router)

export const metadata = {
  title: "Cloud Alpha",
  description: "Multi-cloud management platform",
  icons: {
    icon: [
      {
        url: `data:image/svg+xml,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#3B82F6"/>
            <text
              x="16" y="22"
              font-family="Inter, system-ui, sans-serif"
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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
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
      className={cn("antialiased", dmMono.variable, inter.variable)}
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
      </head>
      <body>
        <ThemeProvider>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
