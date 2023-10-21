const mongoose = require('mongoose')

async function connectDB(){
    try {
        await mongoose.connect('mongodb://127.0.0.1/socialmedia')
        console.log('database connected')
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = connectDB