const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// To read data submitted from HTML form
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://user_453yu2azp:p453yu2azp@db01.dbhost.dev:5050/db_453yu2azp")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log(error);
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
    res.sendFile(path.join(__dirname, "campus.html"));
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
app.listen(3000, () => {
    console.log("Server running on port 3000");
});