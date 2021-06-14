/* eslint-disable camelcase */
import React, { } from 'react'
import { useGithub } from '../../utils/github'
import styles from './GistList.module.css'
import GistItem from '../GistItem/GistItem'
import Loader from '../Loader/Loader'

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
  const { data: gists, loading, error } = useGithub<Gist[]>(`/users/${username}/gists`)

  if (loading) {
    return (
      <Loader />
    )
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

    <ul className={styles.list}>
      {
        gists.map(gist => (
          <GistItem
            gist={gist}
            key={gist.id}
          />
        ))
      }
    </ul>
  )
}

export default GistList
