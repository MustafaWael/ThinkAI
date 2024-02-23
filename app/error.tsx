'use client'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong! {error.name}</h2>
      <p>Something went wrong! {error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
