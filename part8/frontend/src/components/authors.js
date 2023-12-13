import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from '@apollo/client'
import { GET_AUTHORS, CHANGE_BORN } from "../services/queries";

const AuthorsForm = ({ authors }) => {
    const [name, setName] = useState(authors.map(a => a.name)[0])
    const [born, setBorn] = useState('')

    const [ changeBorn, result ] = useMutation(CHANGE_BORN, {
        refetchQueries: [{ query: GET_AUTHORS }]
    })

    const submit = (e) => {
        e.preventDefault()
        
        changeBorn({ variables: { name, born: Number(born) }})

        setName('')
        setBorn('')
    }

    return (
        <div>
            <h3>Change Birthday</h3>

            <form onSubmit={submit}>
                <select onChange={({ target }) => setName(target.value)}>
                    {authors.map(a => 
                        <option key={a.name} value={a.name}>{a.name}</option>
                        )}
                </select>

                <input value={born} onChange={({ target }) => setBorn(target.value)} placeholder="New birthday" />
                <button type="submit">Submit!</button>
            </form>
        </div>
    )
}

const TableKeys = ({ author }) => {
    return (
        <>
        <tr key={author.name}>
            <td>{author.name}</td>
            <td>{author.born}</td>
            <td>{author.countBooks}</td>
        </tr>
        </>
    )
}

const Authors = ({ notify }) => {
    const authors = useQuery(GET_AUTHORS)

    if (authors.loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Born</th>
                    <th>Books</th>
                </tr>
                </thead>
                <tbody>
                {authors.data.allAuthors.map(author =>
                    <TableKeys author={ author } key={ author.id } />
                    )}
                </tbody>
            </table>

            <AuthorsForm authors={authors.data.allAuthors}/>
        </div>
    )
}

export default Authors