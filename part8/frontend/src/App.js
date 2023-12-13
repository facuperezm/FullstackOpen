import React, { useEffect, useState } from "react";
import Books from './components/books'
import Authors from './components/authors'
import { Route, Routes, Navigate } from "react-router-dom";
import NavButton from "./components/navButton";
import Notify from "./components/notify";
import LoginForm from "./components/loginform";
import { useApolloClient, useSubscription } from "@apollo/client";
import { BOOK_ADDED } from './services/queries'
import { updateCacheWith } from './lib/updateCache'

function App() {

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCacheWith(addedBook, client)
    }
  })


  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
        setErrorMessage(null)
    }, 5000)
  }

  useEffect(() => {
    const user = localStorage.getItem('user-token')
    
    if (user) {
      setToken(user)
    }
  }, [])

  const logOut = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div className="App">
      <NavButton />
      {token === null ? <LoginForm setError={setErrorMessage} setToken={setToken}/> : <button onClick={logOut}>LogOut</button>}
      <Notify errorMessage={errorMessage}/>
      <Routes>
        <Route index path='authors' element={<Authors />} />
        <Route path='/books' element={<Books notify={notify} />} />
        <Route path='/' element={<Navigate to='/authors'/>} />
      </Routes>
    </div>
  );
}

export default App;
