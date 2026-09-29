require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function testConnection() {
    try {
        await client.connect();
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.log("MongoDB connection failed:");
        console.log(error.message);
    } finally {
        await client.close();
    }
}

testConnection();