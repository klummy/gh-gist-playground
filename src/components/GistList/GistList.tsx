/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import { useGithub } from '../../utils/github'
import styles from './GistList.module.css'
import GistItem from '../GistItem/GistItem'

export interface GistListProps {
  username: string
}

export interface GistFile {
  filename: string
  language: string
  raw_url: string
  size: string
  type: string
}

export interface Gist {
  comments_url: string
  created_at: string;
  description: string;
  id: string;
  html_url: string;
  files: GistFile[];
  owner: {
    login: string
    html_url: string
  }
  updated_at: string;
}

/**
 * Given a specific username, get the users public gists
 */
const GistList: React.FC<GistListProps> = ({ username }) => {
  const [languages, setLanguages] = useState<string[]>([])
  const { data: gists, loading, error } = useGithub<Gist[]>(`/users/${username}/gists`)

  // When the gists changes, update the languages present in the user list
  useEffect(() => {
    if (!gists || gists.length === 0) {
      setLanguages([])
      return
    }

    // Get files from each gist and flatten
    const files = gists.map(gist => Object.values(gist.files)).flat()

    // Add & dedupe languages
    const languageSet = new Set<string>()
    files.forEach(file => {
      languageSet.add(file.language || 'Undefined')
    })

    setLanguages(Array.from(languageSet))
  }, [gists])

  if (loading) {
    return <span>Loading</span>
  }

  if (error) {
    return (
      <span>User not found. Error loading user details</span>
    )
  }

  if (!Array.isArray(gists) || gists.length === 0) {
    return (
      <span>
        No gist found for user
      </span>
    )
  }

  return (
    <div>
      <ul>
        {
          languages.map(language => (
            <li key={language}>
              {language}
            </li>
          ))
        }
      </ul>

      <ul className={styles.gistList}>
        {
          gists.map(gist => (
            <GistItem
              gist={gist}
              key={gist.id}
            />
          ))
        }
      </ul>
    </div>
  )
}

export default GistList
