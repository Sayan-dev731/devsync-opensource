require('dotenv').config();
const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');
const app = require('./app');
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        // Clean up old indexes that might cause issues
        try {
            await Ticket.cleanupOldIndexes();
            try {
                await mongoose.connection.db.collection('tickets').dropIndex('ticketId_1');
                console.log('Dropped problematic ticketId_1 index');
            } catch (dropError) {
                console.log('Note: ticketId_1 index may not exist or was already dropped');
            }
        } catch (error) {
            console.log('Note: Could not clean up old indexes:', error.message);
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Add ticket cleanup job
const cleanupExpiredTickets = async () => {
    try {
        const now = new Date();
        const expiredTickets = await Ticket.find({
            scheduledForDeletion: { $lte: now },
            status: 'closed'
        });
        if (expiredTickets.length > 0) {
            await Ticket.deleteMany({
                scheduledForDeletion: { $lte: now },
                status: 'closed'
            });
            console.log(`Cleaned up ${expiredTickets.length} expired tickets`);
        }
    } catch (error) {
        console.error('Error cleaning up expired tickets:', error);
    }
};
setInterval(cleanupExpiredTickets, 60 * 60 * 1000);
cleanupExpiredTickets();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Serving frontend from', path.join(__dirname, 'public'));
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    } else {
        throw err;
    }
});
