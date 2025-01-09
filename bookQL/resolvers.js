const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { EventEmitter } = require('events')
const pubsub = new EventEmitter()

const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')

const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: async () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
          if (args.genre) {
            return Book.find({ genres: args.genre }).populate('author')
          }
          return Book.find({}).populate('author')
      },
      allAuthors: async () => {
          return Author.find({})
      },
      me: (root, args, context) => {
        const currentUser = context.currentUser
        //console.log(currentUser)
  
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }
          return context.currentUser
      },
    },
    Mutation: {
      addBook: async (root, args, context) => {
          let author = await Author.findOne({ name: args.author })
          const currentUser = context.currentUser
  
          if (!currentUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
              }
            })
          }
          
          if (!author) {
            author = new Author({ 
              name: args.author, 
              bookCount: 0
            })
            try {
              await author.save()
            } catch (error) {
              throw new GraphQLError('Saving authorfailed', {
                  extensions: 'BAD_USER_INPUT',
                  invalidArgs: args.author,
                  error
              })
            }
          }
        
          const book = new Book({
            title: args.title,
            published: args.published,
            author: author._id,
            genres: args.genres,
          })
          console.log(book)
  
          await book.save()
  
          author.bookCount += 1
          await author.save()
  
          console.log(author)
  
          const populatedBook = book.populate('author')

          pubsub.emit('BOOK_ADDED', { bookAdded: populatedBook })
  
          return populatedBook
      },
      editAuthor: async (root, args, context) => {
          const author = await Author.findOne({ name: args.name })
          author.born = args.born
          const currentUser = context.currentUser
  
          if (!currentUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
              }
            })
          }
  
          try {
              await author.save()
          } catch (error) {
              throw new GraphQLError('Saving born failed', {
                  extensions: 'BAD_USER_INPUT',
                  invalidArgs: args.name,
                  error
              })
          }
          return author
      },
      createUser: async (root, args) => {
          const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
    
          return user.save()
            .catch(error => {
              throw new GraphQLError('Creating the user failed', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  invaildArgs: args.username,
                  error
                }
              })
            })
      },
      login: async (root, args) => {
          const user = await User.findOne({ username: args.username })
    
          if (!user || args.password !== 'secret' ) {
            throw new GraphQLError('wrong credentials', {
              extensions: {
                code: 'BAD_USER_INPUT'
              }
            })
          }
    
          const userForToken = {
            username: user.username,
            id: user._id,
          }
    
          return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      },
    },
    Subscription: {
        bookAdded: {
          subscribe: () => {
            // Basic iterator function for the subscription
            return {
              [Symbol.asyncIterator]() {
                const queue = [];
                const push = (value) => queue.push(value);
                const pull = async () =>
                  new Promise((resolve) => {
                    const interval = setInterval(() => {
                      if (queue.length > 0) {
                        clearInterval(interval);
                        resolve({ value: queue.shift(), done: false });
                      }
                    }, 50);
                  });
    
                pubsub.on('BOOK_ADDED', push);
    
                return {
                  next: pull,
                  return: () => {
                    pubsub.off('BOOK_ADDED', push);
                    return Promise.resolve({ done: true });
                  },
                };
              },
            };
          },
        },
      },
  }

  module.exports = resolvers