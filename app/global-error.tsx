"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-3xl font-bold mb-4">Something went wrong!</h1>
          <p className="mb-6">An unexpected error occurred.</p>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  )
}
