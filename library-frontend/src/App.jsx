import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./queries";
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import LoginForm from "./components/LoginForm";
import Recommended from './components/Recommended'

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a .filter((item) => {
      let k = item
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const authorResult = useQuery(ALL_AUTHORS)

  const bookResult = useQuery(ALL_BOOKS)

  useSubscription(BOOK_ADDED, {
    onData:({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} added!`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

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
