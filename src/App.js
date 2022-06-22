// console.log("npm install axios")

import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [username, setUsername] = useState('');
  
  const [repos, setRepos] = useState([]);
  
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('Loading');



  useEffect(() => {

    const fetchRepos = async (searchTerm) => {
      searchTerm ||= 'laylasouthcombe'
      try {
        const url = `https://api.github.com/users/${searchTerm}/repos`

        // const { data: { students } } = await axios.get(url)
        const { data } = await axios.get(url)
        console.log(data)
        setRepos(data)
        setStatusMessage('')
        setError('')
      } catch (err) {
        setError(err)
        setStatusMessage('Loading...')
      }
    }
    const timeoutId = setTimeout(() => {
      fetchRepos(search)
    }, 400);

    return () => {
      clearTimeout(timeoutId)
    }

  }, [search])

  // nothing => useEffect will run like crazy
  // [] => useEffect will run once
  // [search] => useEffect will run everytime the value changes

  console.log(username)
  const renderedRepos = repos.map(r => {
    return (
      <li key={r.github}>{r.name}</li>
    )
  })

  const onInputChange = (e) => {
    setUsername(e.target.value)
  }

  const onFormSubmit = (e) => {
    e.preventDefault()
    setSearch(username)
    setUsername('')
  }

  return (
    <div className="App">
      <header className="App-header">
        {error
          ? <h1>Sorry, we could not find a(n) {search} username</h1>
          : <div>
            <h3> {statusMessage ? statusMessage : ''} </h3>
            <ul> {renderedRepos} </ul>
          </div>
        }

        <form onSubmit={onFormSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={onInputChange}
          />
        </form>
      </header>
    </div>
  );
}

export default App;
