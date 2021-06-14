import React, { useState } from 'react'
import GistList from '../../components/GistList/GistList'

const App: React.FC = () => {
  const [username, setUsername] = useState('')

  const handleFormSubmission: React.FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault()

    const username = new FormData(event.target as HTMLFormElement).get('username') as string

    setUsername(username)
  }

  return (
    <div>
      <header>
        <form onSubmit={handleFormSubmission}>
          <label htmlFor="username">Username</label>
          <input
            type="search"
            required
            name="username"
            id="username"
          />

          <button type="submit">Search </button>
        </form>
      </header>

      {
        username && (
          <GistList username={username} />
        )
      }

      {/* PENDING: Pagination: Github uses Cursor based pagination to allow for scrolling */}
    </div>
  )
}

export default App
