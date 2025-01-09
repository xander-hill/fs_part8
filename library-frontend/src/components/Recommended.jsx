import { GET_USER } from "../queries"
import { useQuery } from "@apollo/client"
import { useState } from "react"

const Recommended = ({ show, books }) => {
    const user = useQuery(GET_USER)
    console.log(user)

    if (!show) {
        return null
    }

    if (user.loading) {
        return (
            <div>loading...</div>
        )
    }

    const filteredBooks = books.filter(book => book.genres.includes(user.data.me.favoriteGenre))

    return (
        <div>
            <h2>Recommendations</h2>
            <p>Books in your favorite genre {user.data.me.favoriteGenre}</p>
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
        </div>
    )
}

export default Recommended