const { GraphQLList, GraphQLID } = require('graphql') 
const { UserType, PostType, CommentType } = require('./types')
const { User, Post, Comment } = require('../models')

const users = {
    type: new GraphQLList(UserType),
    description: "Gets all the users",
    resolve() {
        return User.find()
    }
}

const user = {
    type: UserType,
    description: "Get a user by id",
    args: {
        id: { type: GraphQLID }
    },
    resolve(_, args) {
        return User.findById(args.id)
    }
}

const posts = {
    type: new GraphQLList(PostType),
    description: "Get all posts",
    resolve: () => Post.find()
}

const post = {
    type: PostType,
    description: "Get a post by id",
    args: {
        id: { type: GraphQLID }
    },
    resolve: (_, { id }) => Post.findById(id)
}

const comments = {
    type: new GraphQLList(CommentType),
    description: "Get all comments",
    resolve: () => Comment.find()
}

const comment = {
    type: CommentType,
    description: "Get a comment by id",
    args: {
        id: { type: GraphQLID }
    },
    resolve: (_, { id }) => Comment.findById(id)
}

module.exports = { 
    users,
    user,
    posts,
    post,
    comments,
    comment
}