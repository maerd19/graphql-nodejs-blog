const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect('mongodb://localhost/blogdb')
    console.log('MongoDb Connected');
}

module.exports = { connectDB }