import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
const firebaseConfig = {
  apiKey: "AIzaSyDv6iJruyVPAfTooQEYVzhVI_ni-NswcCE",
  authDomain: "test-notification-a9a53.firebaseapp.com",
  projectId: "test-notification-a9a53",
  storageBucket: "test-notification-a9a53.appspot.com",
  messagingSenderId: "328066540768",
  appId: "1:328066540768:web:884ae88cd1dd72a9035c85",
  measurementId: "G-9KED1L294M"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const App = () => {
  const [token, setToken] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        messaging.getToken().then(currentToken => {
          if (currentToken) {
            console.log('Device token:', currentToken);
            setToken(currentToken);
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }).catch(error => {
          console.error('An error occurred while retrieving token:', error);
        });
      } else {
        console.log('Permission denied for notifications');
      }
    });

    const handleMessage = (payload) => {
      console.log('Received message:', payload);
    };

    messaging.onMessage(handleMessage);

    return () => {
      messaging.onMessage(handleMessage);
    };
  }, []);

  const handleSendNotification = async () => {
    try {
      console.log(token,"token-----");
      await fetch('http://localhost:3001/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationToken: token,
          notification: {
            title: 'Test Notification',
            body: notification,
          },
        }),
      });
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div>
      <h1>React Firebase Push Notification Example</h1>
      <p>Device token: {token}</p>
      <input
        type="text"
        placeholder="Enter notification message"
        value={notification}
        onChange={e => setNotification(e.target.value)}
      />
      <button onClick={handleSendNotification}>Send Notification</button>
    </div>
  );
};

export default App;
