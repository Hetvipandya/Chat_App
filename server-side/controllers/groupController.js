const Group = require('../models/group')
// const { body, validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// exports.getAllGroups = async (req, res) => {
//     try {
//       const items = await Group.find();
//       res.status(200).json(items);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

exports.getAllGroups = async (req, res) => {
    try {
        console.log('Checking MongoDB connection...');
        
        const groups = await Group.find(); // Fetch all groups
        if (!groups) {
            return res.status(404).json({ message: "No groups found" });
        }
        
        // Check if data is fetched correctly
        console.log('Groups fetched:', groups);

        res.status(200).json(groups); // Return the groups
    } catch (error) {
        console.error('Error fetching groups:', error.message); // Log the error
        res.status(500).json({ message: error.message });
    }
};

exports.getGroup = async (req, res) => {
    try {
        const { memberName } = req.query;

        if (!memberName) {
            return res.status(400).json({ message: 'Member name is required' });
        }

        const groups = await Group.find({ membersName: memberName });

        if (groups.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error:', error); // Debugging log
        res.status(500).json({ message: error.message });
    }
};

exports.createGroup = async (req, res) => {
    const { membersName,groupName,sender } = req.body;
    
    if (!membersName ||!groupName || !sender) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const group = new Group({
        membersName,
        groupName,
        sender
    });

    try {
        const newGroup = await group.save();
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const groupId = req.body.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: "Invalid group ID" });
        }

        // Find the user by ID
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Update user properties
        group.membersName = req.body.membersName || group.membersName;
        group.groupName = req.body.groupName || group.groupName;
        group.sender = req.body.sender || group.sender;
        group.message = req.body.message || group.message;
        group.time = req.body. time || group. time;

        const updatedGroup = await group.save();
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const id = req.body.id;
        //console.log("id:",id)
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid group ID" });
        }

        const group = await Group.findByIdAndDelete(id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};