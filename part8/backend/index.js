// Apollo/GraphQL Server
const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { makeExecutableSchema } = require('@graphql-tools/schema')

// Server Config
const express = require('express')
const mongoose = require('mongoose')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const http = require('http')

// Models
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

// DB URI
const db = process.env.MONGODB_URI
console.log('connecting to', db)


mongoose.connect(db)
  .then(() => {
    console.log('connected to mongodb')
  }).catch(err => {
    console.log('error connection to MongoDB: ', err.message)
  })


const typeDefs = gql`

  enum YesNo {
      YES
      NO
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
      name: String!
      id: ID!
      born: Int
      countBooks: Int!
  }

  type Book {
      title: String!
      published: Int!
      author: [Author]!
      genres: [String!]!
      id: ID!
  }

  type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors(born: YesNo): [Author!]!
      me: User
  }

  type Mutation {
      addBook(
          title: String!
          published: Int!
          author: String!
          genres: [String!]!
      ): Book
      editAuthor(
          name: String!
          born: Int!
      ): Author
      createUser(
        username: String!
        favoriteGenre: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {

        if (!args.author && !args.genre) {
            const books = await Book.find({}).populate('author')
            return books
        } else if (args.author && !args.genre) {
            const filteredBooks = await Book.find({ "name" : args.author }).populate('author')
            return filteredBooks
        } else if (!args.author && args.genre) {
            const filteredGenre = await Book.find({ genre: { $all: [args.genre] } }).populate('author')
            return filteredGenre
        } else {
            const filterAll = await Book.find({ "name": args.author, genre: { $all: [args.genre] } }).populate('author')
            return filterAll
        }


        
      },
      allAuthors: async (root, args) => {

          const authors = await Author.find({})

          const realAuthors = await Promise.all(authors.map(async a => {

            const bookCounter = (await Book.find({}).populate('author')).filter(b => b.author[0].name === a.name).length
            return Object.assign(a, { countBooks: bookCounter })
            }
          )
        ) 

          if (!args.born) {
              return realAuthors
          }

          const byBorn = (author) => 
              args.born === 'YES' ? author.born : !author.born
              return realAuthors.filter(byBorn)
      },
      
      me: (root, args, context) => {
        return context.currentUser
      }
  },

  Mutation: {
      addBook: async (root, args, context) => {

          const currentUser = context.currentUser

          if(!currentUser) {
            throw new AuthenticationError('Not Authenticated')
          }

          const { author, ...rest } = { ...args }
          const createAuthor = new Author({ name: author })
          const createBook = new Book({ ...rest })
          
          const checkBook = await Book.exists({ title: rest.title })
          const checkNewAuthor = await Author.exists({ name: author })

          if (checkBook) {
            throw new UserInputError('Title must be unique', {
                invalidArgs: args.title
            })
          }

          if(checkNewAuthor) {
            try {
              const existAuthor = await Author.find({ name: author })
              
              createBook.author = createBook.author.concat(existAuthor[0])
              
              await createBook.save()

            } catch (err) {
              throw new UserInputError(err.message, {
                invalidArgs: args
              })
            }
          } else {
            try {
              const newAuthor = await createAuthor.save()
              createBook.author = createBook.author.concat(createAuthor)
              await createBook.save()
              
            } catch (err) {
              throw new UserInputError(err.message, {
                invalidArgs: args
              })
            }
          }

          pubsub.publish('BOOK_ADDED', { bookAdded: createBook})

          return createBook

      },

      editAuthor: async (root, args, context) => {

        const currentUser = context.currentUser

        if(!currentUser) {
            throw new AuthenticationError('Not Authenticated')
          }

        try {
          const filter = { name: args.name }
          const propertyToUpdate = { born: args.born }

          const author = await Author.findOneAndUpdate(filter, propertyToUpdate, { new: true })
          return author
        } catch(err) {
          throw new UserInputError(error.message), {
            invalidArgs: args
          }
        }

      },

      createUser: (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
        return user.save()
          .catch(err => {
            throw new UserInputError(err.message, {
              invalidArgs: args
            })
          })
      },

      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })

        if ( !user || args.password !== 'secret') {
          throw new UserInputError('Wrong Credentials')
        }

        const userForToken = {
          username: user.username,
          id: user._id
        }


        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const startApolloServer = async (typeDefs, resolvers) => {
  const app = express()
  const httpServer = http.createServer(app)
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if(auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7), process.env.JWT_SECRET
        )
  
        const currentUser = await User.findById(decodedToken.id)
  
        return { currentUser }
      }
    },
    plugins: [ ApolloServerPluginDrainHttpServer({ httpServer }), {
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close()
          }
        }
      }
    } ]
  })

  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
  }, {
    server: httpServer,
    path: '/graphql'
  })

  await server.start()
  server.applyMiddleware({ app })

  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve))
  console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
}

startApolloServer(typeDefs, resolvers)
