const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// To read data submitted from HTML form
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

// Mongoose Schema
const studentSchema = new mongoose.Schema({
    studentId: String,
    name: String
});

// Mongoose Model
const Student = mongoose.model("Student", studentSchema);

// Display the HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client.html"));
});

// Insert student
app.post("/students", async (req, res) => {
    console.log(req.body);

    const student = new Student({
        studentId: req.body.studentId,
        name: req.body.name
    });

    await student.save();

    res.send("Student added successfully");
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});