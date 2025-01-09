import { useState } from "react"

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  console.log(props.books)

  const filteredBooks = 
    genre 
      ? [...props.books].filter(b => b.genres.includes(genre))
      : props.books

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setGenre('moingo')}>moingo</button>
        <button onClick={() => setGenre('gibby')}>gibby</button>
        <button onClick={() => setGenre('fiction')}>fiction</button>
        <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
