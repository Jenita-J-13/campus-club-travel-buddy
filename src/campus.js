const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Error:", err));

// Mongoose Schema
const memberSchema = new mongoose.Schema({
    memberId: {
        type: String,
        unique: true,
        required: true
    },
    name: String,
    clubName: String,
    yearOfStudy: Number,
    role: String,
    points: Number,
    interests: String,
    status: String
});

const Member = mongoose.model("Member", memberSchema);


// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/campus.html");
});


// 4. ADD MEMBER
app.post("/members", async (req, res) => {
    try {
        const member = new Member(req.body);
        await member.save();

        res.json({
            message: "Member added successfully",
            member: member
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding member",
            error: error.message
        });
    }
});


// 5. DISPLAY MEMBERS OF A CLUB
// WITH POINTS GREATER THAN SPECIFIED VALUE
app.get("/members/club/:clubName", async (req, res) => {
    try {
        const clubName = req.params.clubName;
        const minPoints = Number(req.query.minPoints);

        const members = await Member.find({
            clubName: clubName,
            points: { $gt: minPoints }
        });

        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 6 & 7. SEARCH MEMBER BY MEMBER ID
// DISPLAY ONLY NAME, CLUB NAME, ROLE AND POINTS
app.get("/members/search/:memberId", async (req, res) => {
    try {
        const member = await Member.findOne(
            { memberId: req.params.memberId },
            {
                _id: 0,
                name: 1,
                clubName: 1,
                role: 1,
                points: 1
            }
        );

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 8. UPDATE ROLE AND POINTS
app.put("/members/:memberId", async (req, res) => {
    try {
        const member = await Member.findOneAndUpdate(
            { memberId: req.params.memberId },
            {
                role: req.body.role,
                points: Number(req.body.points)
            },
            { new: true }
        );

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.json({
            message: "Member updated successfully",
            member: member
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 9. INCREASE POINTS OF ALL MEMBERS
// BELONGING TO A PARTICULAR CLUB
app.put("/members/club/:clubName/increase", async (req, res) => {
    try {
        const clubName = req.params.clubName;
        const increase = Number(req.body.points);

        const result = await Member.updateMany(
            { clubName: clubName },
            { $inc: { points: increase } }
        );

        res.json({
            message: "Points increased successfully",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 10. SEARCH MEMBERS WITHIN POINTS RANGE
app.get("/members/range", async (req, res) => {
    try {
        const min = Number(req.query.min);
        const max = Number(req.query.max);

        const members = await Member.find({
            points: {
                $gte: min,
                $lte: max
            }
        });

        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 11. DELETE MEMBER USING MEMBER ID
app.delete("/members/:memberId", async (req, res) => {
    try {
        const member = await Member.findOneAndDelete({
            memberId: req.params.memberId
        });

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.json({
            message: "Member deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 12. DISPLAY ALL MEMBERS
// IN DESCENDING ORDER OF POINTS
app.get("/members", async (req, res) => {
    try {
        const members = await Member.find().sort({ points: -1 });

        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});