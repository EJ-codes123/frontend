import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Image Dashboard",
  description: "Dashboard for AI image generation and manipulation",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <ThemeProvider */}
          {/* attribute="class" */}
          {/* defaultTheme="system" */}
          {/* enableSystem */}
          {/* disableTransitionOnChange */}
        {/* > */}
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

