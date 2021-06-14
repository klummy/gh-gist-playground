import { useEffect, useState } from 'react'
import config from '../config'

const githubClient = async<T>(requestPath: string): Promise<T> => {
  const url = new URL(requestPath, config.github.baseUrl)

  return fetch(url.toString())
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }

      return response.json() as Promise<T>
    })
}

/**
 * Data fetching hook for the Github API
 * @param requestPath Request path e.g. /gists - for fetching Github data
 */
export const useGithub = <T>(requestPath: string) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T | null>()
  const [error, setError] = useState<Error | null>()

  useEffect(() => {
    // Reset values
    setLoading(true)
    setData(null)
    setError(null)

    githubClient<T>(requestPath)
      .then(res => setData(res))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [requestPath])

  return {
    data,
    error,
    loading
  }
}
