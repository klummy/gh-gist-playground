import React, { } from 'react'
import { useGithub } from '../../utils/github'
// import styles from './GistList.module.css'

export interface GistListProps {
  username: string
}

/**
 * Given a specific username, get the users public gists
 */
const GistList: React.FC<GistListProps> = ({ username }) => {
  const { data, loading, error } = useGithub(`/users/${username}/gists`)

  console.log('data => ', data)
  console.log('error => ', error)

  if (loading) {
    return <span>Loading</span>
  }

  return (
    <h1>Username</h1>
  )
}

export default GistList
