const mongoose = require("mongoose");

const connectDB = async(DATABASE_URL)=>{
    try {
        const DB_OPTIONS = {
            dbName: process.env.dbName,
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log("Database server connected");
    } catch (error) {
        console.log("Error ::", error.message);
    }
};

module.exports = connectDB;