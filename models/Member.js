const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    memberId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    clubName: {
        type: String,
        required: true
    },

    yearOfStudy: {
        type: Number,
        required: true
    },

    role: {
        type: String,
        required: true
    },

    points: {
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

module.exports = mongoose.model("Member", memberSchema);