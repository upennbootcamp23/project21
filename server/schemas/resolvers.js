const {User, Book} = require('../models');
const {signToken} = require('../utils/auth');
const {AuthenticationError} = require('@apollo/server/express4');

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if(context.user) {
                let userData = await User.findOne({_id: context.user._id})
                .select('-__v -password');

                return userData;
            }

            throw AuthenticationError("You're not logged in!");
        }
    },

    Mutation: {
        login: async(parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user) {
                throw new AuthenticationError('Incorrect username!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect password!')
            }

            const token = signToken(user);
            return{token, user};
        },
        addUser: async(parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },

        saveBook: async(parent, {input}, context) => {
            if(context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {new: true},
                    {$addToSet: {savedBooks: input}}

                );
                return updatedUser;
            }
            throw new AuthenticationError('Log in in order to save this book!')
        },

        removeBook: async(parent, args, context) => {
            if(context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {new: true},
                    {$addToSet: {savedBooks: input}}

                );
                return updatedUser;
            }
            throw new AuthenticationError('Log in in order to delete this book!')
        }
    }
};

module.exports = resolvers;