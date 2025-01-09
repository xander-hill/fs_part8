import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
import { gql, useQuery, useApolloClient } from '@apollo/client'
import LoginForm from "./components/LoginForm";
import Recommended from './components/Recommended'

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const authorResult = useQuery(ALL_AUTHORS)

  const bookResult = useQuery(ALL_BOOKS)

  if (bookResult.loading || authorResult.loading) {
    return <div>loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("login")}>login</button>
      </div>

      <Authors show={page === "authors"} authors={authorResult.data.allAuthors}/>

      <Books show={page === "books"} books={bookResult.data.allBooks}/>

      <LoginForm show={page === "login"} setToken={setToken} setPage={setPage}/>
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommended")}>recommended</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === "authors"} authors={authorResult.data.allAuthors}/>

      <Books show={page === "books"} books={bookResult.data.allBooks}/>

      <NewBook show={page === "add"} />
      <Recommended show={page === "recommended"} books={bookResult.data.allBooks}/>
    </div>
  );
};

export default App;
