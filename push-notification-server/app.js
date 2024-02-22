const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sendPushNotification = require('./firebase');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/fire').then(()=> console.log("Successfully connected to database")).catch((err)=> console.log(err));

const messageSchema = new mongoose.Schema({
    text: String,
});

const Message = mongoose.model('Message', messageSchema);

app.post('/save-message', async (req, res) => {
    const { text } = req.body;

    try {
        const message = new Message({ text });
        await message.save();
        res.status(201).send('Message saved successfully');
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).send('Error saving message');
    }
});

app.post('/send-notification', async (req, res) => {
    const { registrationToken, notification } = req.body;

    try {
        await sendPushNotification(registrationToken, notification);
        res.status(200).send('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).send('Error sending notification');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
