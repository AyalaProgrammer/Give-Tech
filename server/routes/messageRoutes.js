const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

module.exports = function(io) {

    // --- 1. לוגיקת Socket.io בזמן אמת ---
    io.on('connection', (socket) => {
        console.log('👤 Socket connected to messages:', socket.id);
        socket.on('disconnect', () => {
            console.log('👤 User disconnected from messages');
        });
    });

    // --- 2. נתיבי API (HTTP) ---

    /**
     * @route   PATCH /api/messages/read/:messageId
     * @desc    עדכון הודעה ספציפית כנקראה ושליחת עדכון לסוקט
     */
    router.patch('/read/:messageId', async (req, res) => {
        try {
            console.log("📩 Updating read status for:", req.params.messageId);
            
            const updatedMessage = await Message.findByIdAndUpdate(
                req.params.messageId, 
                { isRead: true },
                { new: true }
            );
            
            if (!updatedMessage) {
                return res.status(404).json({ message: "Message not found" });
            }

            // עדכון ה-Frontend שהמונה צריך לרדת
            io.emit('message_read_update', { receiverId: updatedMessage.receiverId });
            
            res.json({ success: true });
        } catch (err) {
            console.error("❌ Error in PATCH /read:", err.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });

    /**
     * @route   GET /api/messages/unread-count/:volunteerId
     * @desc    קבלת כמות ההודעות שלא נקראו
     */
    router.get('/unread-count/:volunteerId', async (req, res) => {
        try {
            const count = await Message.countDocuments({ 
                receiverId: req.params.volunteerId, 
                isRead: false 
            });
            res.json({ unreadCount: count });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    /**
     * @route   POST /api/messages/
     * @desc    שליחת הודעה חדשה ועדכון הסוקט
     */
    router.post('/', async (req, res) => {
        try {
            const { senderId, receiverId, content } = req.body;
            
            if (!senderId || !receiverId || !content) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const newMessage = new Message({ 
                senderId, 
                receiverId, 
                content,
                isRead: false 
            });

            await newMessage.save();

            // עדכון ה-Frontend שיש הודעה חדשה (המונה יעלה)
            io.emit('new_message', newMessage); 
            
            res.status(201).json(newMessage);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    /**
     * @route   GET /api/messages/:volunteerId
     * @desc    קבלת כל ההודעות של מתנדב (נכנסות ויוצאות)
     */
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