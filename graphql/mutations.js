const { GraphQLString, GraphQLID, graphqlSync } = require("graphql")
const { User, Post, Comment } = require('../models')
const { PostType, CommentType } = require('./types')
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
    async resolve(_, args, { verifiedUser }) {
        const newPost = await new Post({
            title: args.title,
            body: args.body,
            authorId: verifiedUser._id
        })

        await newPost.save()

        return newPost
    }
}

const updatePost = {
    type: PostType,
    description: "Update a post",
    args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
    },
    async resolve(_, { id, title, body }, { verifiedUser }) {
        
        if (!verifiedUser) throw new Error("Unauthorized")

        const updatedPost = await Post.findOneAndUpdate(
            { _id: id, authorId: verifiedUser._id },
            {
                title, body
            },
            {
                new: true,
                runValidators: true
            }
        )

        return updatedPost
    }
}

const deletePost = {
    type: GraphQLString,
    description: "Delete a Post",
    args: {
        postId: { type: GraphQLID },
    },
    async resolve(_, { postId }, { verifiedUser }) {
        
        if (!verifiedUser) throw new Error("Unauthorized")

        const postDeleted = await Post.findOneAndDelete({
            _id: postId,
            authorId: verifiedUser._id
        })

        if (!postDeleted) throw new Error("Post not found")

        return "Post deleted"
    }    
}

const addComment = {
    type: CommentType,
    description: "Add a new comment to a post",
    args: {
        comment: { type: GraphQLString },
        postId: { type: GraphQLID }
    },
    async resolve(_, { comment, postId }, { verifiedUser }) {
        const newComment = await new Comment({
            comment,
            postId,
            userId: verifiedUser._id
        })

        await newComment.save()

        return newComment
    }
}

const updateComment = {
    type: CommentType,
    description: "Update a comment",
    args: {
        id: { type: GraphQLID },
        comment: { type: GraphQLString }
    },
    async resolve(_, { id, comment }, { verifiedUser }) {

        if (!verifiedUser) throw new Error("Unauthorized")

        const updatedComment = await Comment.findOneAndUpdate(
            { _id: id, userId: verifiedUser._id },
            {
                comment
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updateComment) throw new Error("Comment not found")

        return updatedComment
    }
}

const deleteComment = {
    type: GraphQLString,
    description: "Delete a comment",
    args: {
        id: { type: GraphQLID }
    },
    async resolve(_, { id }, { verifiedUser }) {

        if (!verifiedUser) throw new Error("Unauthorized")

        const commentDeleted = await Comment.findOneAndDelete({
            _id: id,
            userId: verifiedUser._id
        })

        if (!commentDeleted) throw new Error('Comment not found')

        return 'Comment deleted'
    }
}

module.exports = {
    register,
    login,
    createPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment
}