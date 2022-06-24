import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);
  const [usernameText, setUsernameText] = useState("");

  const [repoName, setRepoName] = useState("");
  const [openIssueCount, setOpenIssueCount] = useState("");
  const [watcherCount, setWatcherCount] = useState("");
  const [forks, setForks] = useState("");
  
  const [visibility, setVisibility] = useState("hidden")
  const [titleVisibility, setTitleVisibility] = useState("hidden")
  const [usernameTextVisibility, setUsernameTextVisibility] = useState("hidden")

  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('Loading');
 

  useEffect(() => {

    const fetchRepos = async (searchTerm) => {
      searchTerm ||= 'octocat'
      try {
        const url = `https://api.github.com/users/${searchTerm}/repos`
        const { data } = await axios.get(url)
        setRepos(data)
        console.log(data)
        setStatusMessage('')
        setError('')
        setTitleVisibility("visible")
        setUsernameTextVisibility("visible")
      } catch (err) {
        setError(err)
        setStatusMessage('error', err)
      }
    }
    const timeoutId = setTimeout(() => {
      fetchRepos(search)
      setStatusMessage('Loading...')
    }, 400);

    return () => {
      clearTimeout(timeoutId)
    }

  }, [search])

  const onInputChange = (e) => {
    setUsername(e.target.value)
    setUsernameText(e.target.value)
    setRepos([])
    setUsernameTextVisibility("hidden")
    setTitleVisibility("hidden")
  }

  const onFormSubmit = (e) => {
    e.preventDefault()
    setSearch(username)
    setUsername('')
  }

  const onRepoSelect = (e) => {
    const id = e.target.id
    setRepoName(repos[id].name) 
    setOpenIssueCount(repos[id].open_issues_count) 
    setWatcherCount(repos[id].watchers_count) 
    setForks(repos[id].forks)
    setVisibility("visible")
  }

  const renderedRepos = repos.map((r, i) => {
    return (
      <button key={i} id={i} onClick={onRepoSelect}>{r.name}</button>
    )
  })

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={onFormSubmit}>
          <label htmlFor="username" className="username">Username</label>
          <br />
          <input
            type="text"
            id="username"
            value={username}
            onChange={onInputChange}
          />
          <br />
          <input className="search" type="submit" value="Search"/>
        </form>
        {error
          ? <h1>Sorry, we could not find a username called {search}</h1>
          : <div>
            <h3> {statusMessage ? statusMessage : ''} </h3>
            <h3 className="usernameSearchTerm" style={{visibility: usernameTextVisibility}}>{usernameText}</h3>
            <h3 id="reposTitle" className={titleVisibility}>Repositories found:</h3>
            <ul> {renderedRepos} </ul>
          </div>
        }
        <div id="modal" className={visibility}>
          <h2 className="repoName">Repo name: <br/>{repoName}</h2>
          <p className="openIssueCount">Open issues count: {openIssueCount}</p>
          <p className="watchersCount">Watcher count: {watcherCount}</p>
          <p className="forks">Forks: {forks}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
