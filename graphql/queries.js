const {GraphQLString} = require('graphql')

const hello = {
    type: GraphQLString,
    description: 'Returs a string',
    resolve: () => 'Hello world'   
}

module.exports = {hello}