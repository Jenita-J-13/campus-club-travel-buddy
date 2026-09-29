const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve travel.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/travel.html");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err);
    });


// Travel Buddy Schema
const travelBuddySchema = new mongoose.Schema({
    buddyId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    tripDuration: {
        type: Number,
        required: true
    },
    interests: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const TravelBuddy = mongoose.model("TravelBuddy", travelBuddySchema);


// Add Travel Buddy
app.post("/buddies", async (req, res) => {
    try {
        const buddy = new TravelBuddy(req.body);
        await buddy.save();

        res.json({
            message: "Travel Buddy added successfully",
            buddy
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding travel buddy",
            error: error.message
        });
    }
});


// 4. Insert at least 4 records
app.post("/insert-sample", async (req, res) => {
    try {
        const buddies = [
            {
                buddyId: "TB101",
                name: "Arun",
                destination: "Goa",
                age: 22,
                budget: 15000,
                tripDuration: 5,
                interests: ["Beach", "Photography"],
                status: "Active"
            },
            {
                buddyId: "TB102",
                name: "Bavya",
                destination: "Manali",
                age: 21,
                budget: 25000,
                tripDuration: 7,
                interests: ["Hiking", "Nature"],
                status: "Active"
            },
            {
                buddyId: "TB103",
                name: "Gobika",
                destination: "Goa",
                age: 23,
                budget: 20000,
                tripDuration: 6,
                interests: ["Beach", "Adventure"],
                status: "Active"
            },
            {
                buddyId: "TB104",
                name: "Kayalvizhi",
                destination: "Ooty",
                age: 20,
                budget: 10000,
                tripDuration: 3,
                interests: ["Nature", "Photography"],
                status: "Active"
            }
        ];

        await TravelBuddy.insertMany(buddies);

        res.json({
            message: "4 travel buddy records inserted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error inserting records",
            error: error.message
        });
    }
});


// 5. Find people travelling to a destination
// whose budget is greater than specified amount
app.get("/buddies/filter", async (req, res) => {
    try {
        const { destination, budget } = req.query;

        const buddies = await TravelBuddy.find({
            destination: destination,
            budget: { $gt: Number(budget) }
        });

        res.json(buddies);

    } catch (error) {
        res.status(500).json({
            message: "Error filtering buddies",
            error: error.message
        });
    }
});


// 6. Search using Buddy ID
app.get("/buddies/:buddyId", async (req, res) => {
    try {
        const buddy = await TravelBuddy.findOne({
            buddyId: req.params.buddyId
        });

        if (!buddy) {
            return res.status(404).json({
                message: "Travel Buddy not found"
            });
        }

        res.json(buddy);

    } catch (error) {
        res.status(500).json({
            message: "Error searching buddy",
            error: error.message
        });
    }
});


// 7. Display only Name, Destination, Budget, Trip Duration
app.get("/buddies/details/selected", async (req, res) => {
    try {
        const buddies = await TravelBuddy.find()
            .select("name destination budget tripDuration -_id");

        res.json(buddies);

    } catch (error) {
        res.status(500).json({
            message: "Error displaying selected details",
            error: error.message
        });
    }
});


// 8. Update destination and budget using Buddy ID
app.put("/buddies/:buddyId", async (req, res) => {
    try {
        const { destination, budget } = req.body;

        const buddy = await TravelBuddy.findOneAndUpdate(
            { buddyId: req.params.buddyId },
            {
                destination: destination,
                budget: Number(budget)
            },
            { new: true }
        );

        if (!buddy) {
            return res.status(404).json({
                message: "Travel Buddy not found"
            });
        }

        res.json({
            message: "Destination and budget updated successfully",
            buddy
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating buddy",
            error: error.message
        });
    }
});


// 9. Increase budget of all buddies travelling to a destination
app.put("/buddies/increase-budget/:destination", async (req, res) => {
    try {
        const amount = Number(req.body.amount);

        const result = await TravelBuddy.updateMany(
            { destination: req.params.destination },
            { $inc: { budget: amount } }
        );

        res.json({
            message: "Budget increased successfully",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        res.status(500).json({
            message: "Error increasing budget",
            error: error.message
        });
    }
});


// 10. Find buddies within budget range
app.get("/buddies/range/search", async (req, res) => {
    try {
        const min = Number(req.query.min);
        const max = Number(req.query.max);

        const buddies = await TravelBuddy.find({
            budget: {
                $gte: min,
                $lte: max
            }
        });

        res.json(buddies);

    } catch (error) {
        res.status(500).json({
            message: "Error finding buddies",
            error: error.message
        });
    }
});


// 11. Delete using Buddy ID
app.delete("/buddies/:buddyId", async (req, res) => {
    try {
        const buddy = await TravelBuddy.findOneAndDelete({
            buddyId: req.params.buddyId
        });

        if (!buddy) {
            return res.status(404).json({
                message: "Travel Buddy not found"
            });
        }

        res.json({
            message: "Travel Buddy deleted successfully",
            buddy
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting buddy",
            error: error.message
        });
    }
});


// 12. Display all remaining buddies in descending order of budget
app.get("/buddies/final/all", async (req, res) => {
    try {
        const buddies = await TravelBuddy.find()
            .sort({ budget: -1 });

        res.json(buddies);

    } catch (error) {
        res.status(500).json({
            message: "Error displaying final records",
            error: error.message
        });
    }
});


// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});