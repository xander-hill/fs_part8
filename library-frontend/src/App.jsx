import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
import { gql, useQuery } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState("authors");

  const authorResult = useQuery(ALL_AUTHORS)
  console.log("Author data:", authorResult)

  const bookResult = useQuery(ALL_BOOKS)
  console.log("Book data", bookResult)

  if (bookResult.loading || authorResult.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} authors={authorResult.data.allAuthors}/>

      <Books show={page === "books"} books={bookResult.data.allBooks}/>

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
