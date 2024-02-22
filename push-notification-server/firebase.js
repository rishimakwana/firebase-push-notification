const admin = require('firebase-admin');
const serviceAccount = require('./firebaseConfig.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const sendPushNotification = async (registrationToken, notification) => {
    try {

        let message = {
            token: registrationToken,
            notification: {
                title: notification.title,
                body: notification.body,
            },
        }
        const response = await admin.messaging().send(message);

        console.log('Push notification sent successfully', response);
    } catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
    }
};


module.exports = sendPushNotification;
