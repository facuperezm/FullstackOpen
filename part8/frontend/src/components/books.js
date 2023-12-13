import React, { useState } from "react";
import { useMutation, useQuery } from '@apollo/client'
import { useField } from "../hooks/hooks";
import { CREATE_BOOK, ALL_BOOKS } from "../services/queries";
import { updateCacheWith } from "../lib/updateCache";

const BookForm = ({ setError }) => {
    const title = useField({name: 'title'})
    const author = useField({name: 'author'})
    const published = useField({name: 'published'})
    const genres = useField({name: 'genres'})

    const [ createBook ] = useMutation(CREATE_BOOK, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        }
    })

    const submit = async (event) => {
        event.preventDefault()

        createBook({ variables: {title: title.value, author: author.value, published: Number(published.value), genres: [genres.value]} })

        event.target.title.value = ''
        event.target.author.value = ''
        event.target.published.value = ''
        event.target.genres.value = ''
    }

    return (
        <div>
            <h3>Add Book</h3>
            <form onSubmit={submit}>
                <input {...title} placeholder="Title"/>
                <input {...author} placeholder="Author"/>
                <input {...published} placeholder="Published"/>
                <input {...genres} placeholder="Genre"/>
                <button type="submit">Add!</button>
            </form>
        </div>
    )
}

const style = {
    padding: '0 1em'
}

const TableKey = ({ book }) => {
    return (
        <>
        <tr>
            <td style={style}>{book.title}</td>
            <td style={style}>{book.author[0].name}</td>
            <td style={style}>{book.published}</td>
        </tr>
        </>
    )
}

const Books = ({ notify }) => {

    const books = useQuery(ALL_BOOKS)

    if (books.loading) {
        return <div>Loading...</div>
    } else {
        return (
            <>
            <h1>Books</h1>
            
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Published</th>
                </tr>
                </thead>
                <tbody>
    
                
                {books?.data?.allBooks.map(book => 
                    <TableKey book={ book } key={book.id} />
                    )}
                 </tbody>
            </table>
                
                
                    
            <BookForm setError={notify} />
            </>
        )
    }

}

export default Books