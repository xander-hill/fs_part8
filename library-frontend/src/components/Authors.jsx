import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client"

import { EDIT_BORN } from "../queries"

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ changeBorn, result] = useMutation(EDIT_BORN)

  const submit = (event) => {
    event.preventDefault()
    const intBorn = parseInt(born)

    changeBorn({ variables: { name, born: intBorn }})
    console.log(result.data)
    setName('')
    setBorn('')
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {props.authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            {/* <div>
              name
              <input value={name}
              onChange={({ target }) => setName(target.value)} />
            </div> */}
            <select value={name} onChange={({ target }) => setName(target.value)}>
              {props.authors.map(a => (
                <option key={a.id} value={a.name}>{a.name}</option>
              ))}
            </select>
            <div>
              born
              <input value={born}
              onChange={({ target }) => setBorn(target.value)} />
            </div>
            <button type='submit'>update author</button>
          </form>
    </div>
  )
}

export default Authors
