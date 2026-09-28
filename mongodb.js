require("dotenv").config();

const mongoose = require("mongoose");

// CREATE SCHEMA
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    course: {
        type: String,
        required: true
    }
});

// CREATE MODEL
const Student = mongoose.model("Student", studentSchema);

async function main() {
    try {

        // CONNECT
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // INSERT
        const student = await Student.create({
            name: "Rahul",
            age: 21,
            email: "rahul@gmail.com",
            course: "Computer Science"
        });

        console.log("\nInserted Student:");
        console.log(student);

        /*
        // SELECT
        const students = await Student.find();

        console.log("\nAll Students:");
        console.log(students);

        // SELECT ONE
        const oneStudent = await Student.findOne({
            email: "rahul@gmail.com"
        });

        console.log("\nOne Student:");
        console.log(oneStudent);

        // UPDATE
        const updatedStudent = await Student.findOneAndUpdate(
            { email: "rahul@gmail.com" },
            { age: 22 },
            { new: true }
        );

        console.log("\nUpdated Student:");
        console.log(updatedStudent);

        // DELETE
        const deletedStudent = await Student.findOneAndDelete({
            email: "rahul@gmail.com"
        });

        console.log("\nDeleted Student:");
        console.log(deletedStudent);
        */

    } catch (error) {
        console.log("Error:");
        console.log(error);

    } finally {
        await mongoose.connection.close();
        console.log("\nMongoDB connection closed");
    }
}

main();