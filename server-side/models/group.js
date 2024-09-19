const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema(
    {
        membersName: {
            type:String,
            required:true
        },
        groupName: {
            type:String,
            required:true
        },
        sender: {
            type: String,
            required: true
        },
    }
);

module.exports = mongoose.model('Group',groupSchema)