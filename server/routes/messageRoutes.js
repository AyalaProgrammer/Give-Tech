const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

module.exports = function (io) {
    
    router.get('/unread-count/:volunteerId', async (req, res) => {
        try {
            const { volunteerId } = req.params;
            

            const count = await Message.countDocuments({ 
                receiverId: volunteerId, 
                isRead: false 
            });
            
            console.log(`Checking unread for: ${volunteerId}, Found: ${count}`);
            res.json({ count: count });
        } catch (err) { 
            console.error("Error in unread-count:", err);
            res.status(500).json({ count: 0 }); 
        }
    });

 
    router.get('/conversations/:volunteerId', async (req, res) => {
        try {
            const { volunteerId } = req.params;
            const allMessages = await Message.find({
                $or: [{ senderId: volunteerId }, { receiverId: volunteerId }]
            }).sort({ createdAt: -1 });

            const conversationsMap = {};
            allMessages.forEach(msg => {
                const partnerId = msg.senderId === volunteerId ? msg.receiverId : msg.senderId;
                if (!partnerId) return;

                if (!conversationsMap[partnerId]) {
                    conversationsMap[partnerId] = {
                        partnerId: partnerId,
                        partnerName: msg.senderId === volunteerId ? msg.receiverName : msg.senderName,
                        lastMessage: msg.content,
                        timestamp: msg.createdAt,
                        unreadCount: 0
                    };
                }
                if (msg.receiverId === volunteerId && !msg.isRead) {
                    conversationsMap[partnerId].unreadCount++;
                }
            });
            res.json(Object.values(conversationsMap));
        } catch (err) { res.status(500).send(err.message); }
    });


    router.post('/', async (req, res) => {
        try {
            const { senderId, senderName, receiverId, receiverName, content } = req.body;
            const newMessage = new Message({ 
                senderId, senderName, receiverId, receiverName, content, isRead: false 
            });
            await newMessage.save();
      
            io.emit('new_message', newMessage);
            res.status(201).json(newMessage);
        } catch (err) { res.status(400).json({ message: err.message }); }
    });


    router.patch('/read-all/:volunteerId/:partnerId', async (req, res) => {
        try {
            const { volunteerId, partnerId } = req.params;
            await Message.updateMany(
                { receiverId: volunteerId, senderId: partnerId, isRead: false },
                { $set: { isRead: true } }
            );
            io.emit('messages_marked_read', { receiverId: volunteerId });
            res.json({ success: true });
        } catch (err) { res.status(500).json({ message: err.message }); }
    });

    router.get('/:volunteerId/:partnerId', async (req, res) => {
        try {
            const { volunteerId, partnerId } = req.params;
            const messages = await Message.find({
                $or: [
                    { senderId: volunteerId, receiverId: partnerId },
                    { senderId: partnerId, receiverId: volunteerId }
                ]
            }).sort({ createdAt: 1 });
            res.json(messages);
        } catch (err) { res.status(500).json({ message: err.message }); }
    });

    return router;
};