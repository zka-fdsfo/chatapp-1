// utils/getFcmToken.js
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

export const getFcmToken = async () => {
  const permission = await Notification.requestPermission();

  console.log("Permission:", permission);

  if (permission !== "granted") {
    return null;
  }
console.log("geting or not",import.meta.env.VITE_FIREBASE_VAPID_KEY);
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });

  console.log("Token:", token);

  return token;
};