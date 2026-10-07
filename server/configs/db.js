const mongoose = require("mongoose")

const connectDB = async() => {
    try{
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/electronics"
        await mongoose.connect(uri)
        console.log("Database Connected")
    }
    catch(error){
        console.log(error)
    }
}

module.exports = connectDB