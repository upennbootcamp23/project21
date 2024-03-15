//Imports
const jwt = require('jsonwebtoken');
const {GraphQLError} = require('graphql');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // a pre-defined GraphQLError object with a specific message and extension code for cases where 
  //user authentication fails.
  AuthenticationError: new GraphQLError('User Authentication Failed.', {
    extension: {
      code: 'UNAUTHENTICATED',
    },
  }),

  //a function that acts as middleware for authentication
  authMiddleware: function ({ req }) {

    //checks for a token in three places: request body, query string, and authorization header.
    let token = req.body.token ||req.query.token || req.headers.authorization;

    //extracting the actual token value from the formatted string.
    if(req.header.authorization) {
      token = token.split('').pop.trim();
    }

    //returning the request object as is.
    if(!token) {
      return req;
    }

    try {
      //extracting the data portion of the decoded token and assigns it to a new property user on the 
      //request object.
      const {data} = jwt.verify(token, secret, {maxAge: expiration});
      req.user = data;

      //logging a message but doesn't throw an error. This middleware silently handles invalid tokens.
    } catch {
      console.log('Invalid Token');
    } 

    //returning request
    return req;
  },

    signToken: function({email, username, _id}) {
      const payload = {email, username, _id};
      return jwt.sign({data: payload}, secret, {expiresIn: expiration});
    }, 
  };


