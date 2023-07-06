const mongoose = require('mongoose')

async function connectDB(){
    try {
        await mongoose.connect('mongodb://localhost/socialmedia')
        console.log('database connected')
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = connectDB