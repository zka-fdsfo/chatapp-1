import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import toast from "react-hot-toast";

function NotificationListener() {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      toast.success(
        `${payload.notification.title}: ${payload.notification.body}`
      );
    });

    return unsubscribe;
  }, []);

  return null;
}

export default NotificationListener;