import React, { useEffect, useState } from 'react'
import { useGithub } from '../../utils/github'
import { Gist } from '../GistList/GistList'
import Loader from '../Loader/Loader'
import styles from './GistItem.module.css'

export interface GistItemProps {
  gist: Gist
}

// Since gists don't have names, set the description as the name by default but default
// to the names of the files in the gist if that isn't available
const composeGistName = (gist: Gist): string => gist.description || Object.keys(gist.files).join('; ')

/**
 * Load the forks for a given gist ID
 * This helps avoid making too many requests to the Github REST API at the same time
 * i.e. if all forks are loaded when all gists are loaded
 * Ways around this could be to look into using the Github's GraphQL API which possibly may allow
 * loading specific fields as needed. Also, batching may be helpful here if the Github API supports it
 */
const ViewForks: React.FC<{
  gistId: string
}> = ({ gistId }) => {
  const { data: forksData, error, loading } = useGithub<Gist[]>(`/gists/${gistId}/forks?per_page=3`)

  if (loading) {
    return (
      <Loader />
    )
  }

  if (error || !Array.isArray(forksData) || forksData.length === 0) {
    return (
      <span>
        No forks found for gist
      </span>
    )
  }

  return (
    <ul className={styles.forks}>
      {
        forksData.map(fork => (
          <li key={fork.id}>
            <a href={fork.html_url} target="_blank" className={styles.forkLink} rel="noreferrer">
              {composeGistName(fork)} by {fork.owner?.login}
            </a>
          </li>
        ))
      }
    </ul>
  )
}

const GistItem: React.FC<GistItemProps> = ({ gist }) => {
  const [languages, setLanguages] = useState<string[]>([])
  const [showForks, setShowForks] = useState(false)
  const gistName = composeGistName(gist)

  useEffect(() => {
    if (!gist) return
    // Dedupe language values
    const languageSet = new Set(Object.values(gist.files).map(file => file.language || 'Other'))

    setLanguages(Array.from(languageSet))
  }, [gist])

  return (
    <li className={styles.item}>
      <a
        href={gist.html_url}
        target="_blank"
        rel="noreferrer"
        className={styles.itemLink}
      >
        <div className={styles.details}>
          <span className={styles.title} title={gistName}>
            {gistName}
          </span>

          <button
            className={styles.viewForksButton}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setShowForks(!showForks)
            }}
            type="button" >
            {showForks ? 'Hide' : 'Show'} forks
          </button>
        </div>

        <div className={styles.badges}>

          {
            languages.map(lang => (
              <span key={lang} className={styles.badge}>
                {lang}
              </span>
            ))
          }
        </div>

      </a>

      {
        showForks && (
          <ViewForks gistId={gist.id} />
        )
      }
    </li>
  )
}

export default GistItem
