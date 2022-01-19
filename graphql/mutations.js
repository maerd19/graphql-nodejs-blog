const { GraphQLString } = require("graphql");
const { User, Post } = require('../models')
const { PostType } = require('./types')
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

const login = {
    type: GraphQLString,
    description: "Login a user and returns a token",
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(_, args) {
        const user = await User.findOne({ email: args.email }).select('+password')

        console.log(user);

        if (!user || args.password !== user.password) 
            throw new Error('Invalid Credentials')

        const token = createJWTToken({
            _id: user._id,
            username: user.username,
            email: user.email
        })

        return token
    }
}

const createPost = {
    type: PostType,
    description: "Create a new post",
    args: {
        title: { type: GraphQLString },
        body: { type: GraphQLString }
    },
    async resolve(_, args) {
        console.log(args);

        const newPost = await new Post({
            title: args.title,
            body: args.body,
            authorId: "61e80a61edb29aa3f9c6821b"
        })

        console.log(newPost)

        return newPost
    }
}

module.exports = {
    register,
    login,
    createPost
}