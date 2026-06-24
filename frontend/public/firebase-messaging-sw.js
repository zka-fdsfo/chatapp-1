importScripts("https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Show the notification as usual
  self.registration.showNotification(
    payload.data?.title || 'New Message',
    {
      body: payload.data?.body || '',
      icon: payload.data?.senderAvatar || '/logo.png',
    }
  );

  // ✅ Post message to ALL open tabs of your app
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'BACKGROUND_NOTIFICATION',
        payload,
      });
    });
  });
});