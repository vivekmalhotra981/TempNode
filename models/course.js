const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
const postSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    category: {
        type: String
    },
    joinedBy: [{
        type: ObjectId,
        ref: "User"
    }],
    created:{
        type: Date,
        default: Date.now
    },
    updated: Date
});

module.exports = mongoose.model("Course", postSchema);