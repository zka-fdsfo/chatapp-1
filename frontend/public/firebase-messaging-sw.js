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
  // const title = payload.data?.title || "New Message";
  // const body = payload.data?.body || "";
  // const icon = payload.data?.senderAvatar || "/logo.png"; // ← your app logo

  // return self.registration.showNotification(title, {
  //   body,
  //   icon,
  //   badge: "/logo.png",
  //   data: payload.data,
  // });
});