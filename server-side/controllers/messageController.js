const Message = require('../models/message')
// const { body, validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.getAllMessage = async (req, res) => {
    try {
        const MessageModule = await Message.find();
        res.status(200).json(MessageModule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMessage = async(req,res) => {
    try{
        const message = await Message.findById(req.params.id);
        if(!message) return res.status(404).json({message:'Message not found'});
        res.status(200).json(login);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.createMessage = async (req, res) => { 
    const { sender,receiver,message,time } = req.body;
    
    if (!sender || !receiver || !message || !time) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const messages = new Message({ 
        sender,
        receiver,
        message,
        time
    });

    try {
        const newMessage = await messages.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// exports.deleteMessage = async (req, res) => {
//     try {
//         const id = req.body.id;
//         //console.log("id:",id)
//         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "Invalid message ID" });
//         }

//         const login = await login.findByIdAndDelete(id);
//         if (!login) {
//             return res.status(404).json({ message: "Message not found" });
//         }

//         res.status(200).json({ message: "Message deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid message ID" });
        }

        const message = await Message.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};