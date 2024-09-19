const Login = require('../models/login');
// const { body, validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.getAllLogin = async (req, res) => {
    try {
        const LoginModule = await Login.find();
        res.status(200).json(LoginModule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLogin = async (req, res) => {
    try {
        const login = await Login.findById(req.params.id);
        if (!login) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("Sending response:", login); // Log the response
        res.status(200).json(login);
    } catch (error) {
        console.error("Error fetching login:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.createLogin = async (req, res) => {
    const { userName,password } = req.body;

    if (!userName ||!password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const login = new Login({
        userName,
        password
    });

    try {
        const newUser = await login.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteLogin = async (req, res) => {
    try {
        const { userName } = req.body; 
        console.log("Received Username:", userName);

        if (!userName) {
            return res.status(400).json({ message: "Username is required" });
        }
        
        const login = await Login.findOneAndDelete({ userName });
        if (!login) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
