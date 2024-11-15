// register.controller.js
const AccessService = require('../services/register.service'); // Access service for user registration

class RegisterController {
    static register = async (req, res, next) => {
        try {
            const { name, email, password } = req.body; // User input

            // Call AccessService to handle sign-up logic
            const result = await AccessService.signUp({ name, email, password });

            if (result.code === 201) {
                // Success response
                return res.status(201).json({
                    message: 'Account created successfully',
                    metadata: result.metadata, // Include metadata (tokens and user details)
                });
            z}

            // Failure response
            return res.status(400).json({
                message: result.message || 'Error creating account',
                status: result.status || 'error',
            });
        } catch (error) {
            next(error); // Handle any errors that occur during the process
        }
    };
}

const getRegister = (req, res) => {
    res.render('register');
}

module.exports = {RegisterController, getRegister};
