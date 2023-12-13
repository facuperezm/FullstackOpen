const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
} = require("apollo-server");

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
 */

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String, title: String): [Book!]
    allAuthors(name: String, bookCount: Int): [Author!]
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        const books = await Book.find({}).populate("author");
        return books;
      } else if (args.author && !args.genre) {
        const filteredBooks = await Book.find({ name: args.author }).populate(
          "author"
        );
        return filteredBooks;
      } else if (!args.author && args.genre) {
        const filteredGenre = await Book.find({
          genre: { $all: [args.genre] },
        }).populate("author");
        return filteredGenre;
      } else {
        const filterAll = await Book.find({
          name: args.author,
          genre: { $all: [args.genre] },
        }).populate("author");
        return filterAll;
      }
    },
  },
};

// const mutation = {
//   addBook: async (root, args, context) => {
//     const currentUser = context.currentUser

//     if ( !currentUser) {
//       throw new AuthenticationError('Not Authenticated')
//     }
//     const { author, ...rest } = { ...args }
//     const createAuthor = new Author({ name: author })
//     const createBook = new Book({ ...rest })

//     const checkBook = await Book.exists({ title: rest.title })
//     const checkNewAuthor = await Author.exists({ name: author })

//     if (checkBook) {
//       throw new UserInputError('Title must be unique', {
//           invalidArgs: args.title
//       })
//     }

//     if(checkNewAuthor) {
//       try {
//         const existAuthor = await Author.find({ name: author })

//         createBook.author = createBook.author.concat(existAuthor[0])

//         await createBook.save()

//       } catch (err) {
//         throw new UserInputError(err.message, {
//           invalidArgs: args
//         })
//       }
//     } else {
//       try {
//         const newAuthor = await createAuthor.save()
//         createBook.author = createBook.author.concat(createAuthor)
//         await createBook.save()

//       } catch (err) {
//         throw new UserInputError(err.message, {
//           invalidArgs: args
//         })
//       }
//     }

//     pubsub.publish('BOOK_ADDED', { bookAdded: createBook})

//     return createBook
//   }
//   editAuthor: async (root, args, context) => {

//     const currentUser = context.currentUser

//     if(!currentUser) {
//         throw new AuthenticationError('Not Authenticated')
//       }

//     try {
//       const filter = { name: args.name }
//       const propertyToUpdate = { born: args.born }

//       const author = await Author.findOneAndUpdate(filter, propertyToUpdate, { new: true })
//       return author
//     } catch(err) {
//       throw new UserInputError(error.message), {
//         invalidArgs: args
//       }
//     }

//   },

//   createUser: (root, args) => {
//     const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
//     return user.save()
//       .catch(err => {
//         throw new UserInputError(err.message, {
//           invalidArgs: args
//         })
//       })
//   },

//   login: async (root, args) => {
//     const user = await User.findOne({ username: args.username })

//     if ( !user || args.password !== 'secret') {
//       throw new UserInputError('Wrong Credentials')
//     }

//     const userForToken = {
//       username: user.username,
//       id: user._id
//     }

//     return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
//   }
// },
// }

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
