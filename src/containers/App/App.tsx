import React, { useState } from 'react'
import GistList from '../../components/GistList/GistList'
import styles from './App.module.css'

const App: React.FC = () => {
  const [username, setUsername] = useState('')

  const handleFormSubmission: React.FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault()

    const username = new FormData(event.target as HTMLFormElement).get('username') as string

    setUsername(username)
  }

  return (
    <main className={styles.app}>
      <form onSubmit={handleFormSubmission} className={styles.form}>
        <input
          className={styles.searchInput}
          type="search"
          required
          name="username"
          id="username"
          placeholder="Search username"
        />

        <button className={styles.button} type="submit">Search </button>
      </form>

      {
        username && (
          <GistList username={username} />
        )
      }

      {/* PENDING: Pagination: Github uses Cursor based pagination to allow for scrolling */}
    </main>
  )
}

export default App
