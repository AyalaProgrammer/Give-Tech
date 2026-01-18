const express = require('express');
const router = express.Router();
const Message = require('../models/Message');


module.exports = function(io) {


    router.post('/', async (req, res) => {
        try {
            const { senderId, receiverId, content } = req.body;
            const newMessage = new Message({ senderId, receiverId, content });
            await newMessage.save();

            io.emit('new_message', newMessage); 
            
            res.status(201).json(newMessage);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });


    router.get('/:volunteerId', async (req, res) => {
        try {
            const messages = await Message.find({ 
                $or: [
                    { receiverId: req.params.volunteerId },
                    { senderId: req.params.volunteerId }
                ]
            }).sort({ createdAt: -1 });
            res.json(messages);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    return router;
};