export const metadata = {
  title: 'Mastermind Solver',
  description: 'Deterministic Mastermind codebreaker using Next.js + Tailwind',
}

import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased text-gray-900 bg-gray-50">
        {children}
      </body>
    </html>
  )
}
