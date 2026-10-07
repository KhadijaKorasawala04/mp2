import { useEffect, useState } from 'react'

interface Result<T> {
  load: () => Promise<T>
  data?: T
  error?: boolean
}


export function useAsync<T>(load: () => Promise<T>) {
  const [result, setResult] = useState<Result<T>>()

  useEffect(() => {
    let active = true
    load().then(
      (data) => {
        if (active) setResult({ load, data })
      },
      () => {
        if (active) setResult({ load, error: true })
      },
    )
    return () => {
      active = false
    }
  }, [load])


  // ignore results from an older load
  const current = result?.load === load ? result : undefined

  return { data: current?.data, error: current?.error ?? false }
}
