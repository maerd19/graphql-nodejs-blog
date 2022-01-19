const { GraphQLList, GraphQLID } = require('graphql') 
const { UserType } = require('./types')
const { User } = require('../models')

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

module.exports = { 
    users,
    user
}