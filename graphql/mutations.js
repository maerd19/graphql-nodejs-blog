const { GraphQLString } = require("graphql");
const { User } = require('../models')
const { createJWTToken } = require('../util/auth')

const register = {
    type: GraphQLString,
    description: "Register a new user and returns a token",
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        displayName: { type: GraphQLString } 
    },
    async resolve(_, args) {
        const { username, email, password, displayName } = args

        const newUser = await User.create({username, email, password, displayName})

        const token = createJWTToken({ _id: newUser._id, username: newUser.username, email: newUser.email })

        return token
    }
}

module.exports = {
    register
}