import { ALL_BOOKS } from "../services/queries"

export const updateCacheWith = async (addedBook, client) => {
    const includedIn = (set, object) => {
        set.map(book => book.id).includes(object.id)
    }

    const dataInStore = await client.readQuery({ query: ALL_BOOKS })

    if (!includedIn(dataInStore.allBooks, addedBook)) {
        client.writeQuery({
            query: ALL_BOOKS,
            data: { allBooks: dataInStore.allBooks.concat(addedBook) }
        })
    }
}