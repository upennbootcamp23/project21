const typeDefs = `
    type Auth {
        token: ID
        user: User    
    }  
    input bookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
    }
      
    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
    type User {
        id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
    type Query {
        me: User
    }
    type Mutation {
        saveBook(input: bookInput): User
        removeBook(bookId: String!): User
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
    }

`;

module.exports = typeDefs;