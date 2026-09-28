const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("src"));

const client = new MongoClient(process.env.MONGO_URI);

let members;
let travellers;

async function connectDB() {
    await client.connect();

    const db = client.db("campusTravelDB");

    members = db.collection("members");
    travellers = db.collection("travellers");

    console.log("MongoDB Connected");
}

// Campus Club Members
app.post("/members", async (req, res) => {

    const member = {
        name: req.body.name,
        email: req.body.email,
        department: req.body.department,
        club: req.body.club
    };

    await members.insertOne(member);

    res.send("Member added successfully");
});

app.get("/members", async (req, res) => {

    const data = await members.find().toArray();

    res.json(data);
});

// Travel Buddy Finder
app.post("/travellers", async (req, res) => {

    const traveller = {
        name: req.body.name,
        email: req.body.email,
        destination: req.body.destination,
        travelDate: req.body.travelDate
    };

    await travellers.insertOne(traveller);

    res.send("Traveller added successfully");
});

app.get("/travellers", async (req, res) => {

    const data = await travellers.find().toArray();

    res.json(data);
});

app.listen(process.env.PORT, async () => {

    await connectDB();

    console.log(`Server running on port ${process.env.PORT}`);
});