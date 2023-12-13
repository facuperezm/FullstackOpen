import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title,
        author { name },
        published,
        genres,
        id
}
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }

    ${BOOK_DETAILS}
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}

`


export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
      addBook(
          title: $title,
          author: $author,
          published: $published,
          genres: $genres
      ) {
          title,
          published,
          genres,
          author { name },
          id
      }
  }
`

export const GET_AUTHORS = gql`
    query {
        allAuthors {
            name,
            born,
            countBooks,
            id
        }
    }
`

export const CHANGE_BORN = gql`
    mutation editBorn($name: String!, $born: Int!) {
        editAuthor (
            name: $name,
            born: $born
        ) {
            name,
            born,
            countBooks,
            id
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login (
            username: $username,
            password: $password
        ) {
            value
        }
    }
`