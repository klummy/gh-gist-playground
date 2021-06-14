import React, { useState } from 'react'
import { useGithub } from '../../utils/github'
import { Gist } from '../GistList/GistList'
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
      <span>Loading</span>
    )
  }

  if (error || !Array.isArray(forksData) || forksData.length === 0) {
    return (
      <span>
        No forks found for specified gist
      </span>
    )
  }

  return (
    <ul className={styles.forks}>
      {
        forksData.map(fork => (
          <li key={fork.id}>{composeGistName(fork)} by {fork.owner?.login}</li>
        ))
      }
    </ul>
  )
}

const GistItem: React.FC<GistItemProps> = ({ gist }) => {
  const [showForks, setShowForks] = useState(false)

  const gistName = composeGistName(gist)

  return (
    <li className={styles.item}>
      <a href={gist.html_url} target="_blank" rel="noreferrer">
        {gistName}
      </a>

      <button
        onClick={() => setShowForks(!showForks)}
        type="button" >
        {showForks ? 'Hide' : 'Show'} forks
      </button>

      {
        showForks && (
          <ViewForks gistId={gist.id} />
        )
      }
    </li>
  )
}

export default GistItem
