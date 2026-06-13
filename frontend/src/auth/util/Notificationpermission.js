
import { getFcmToken } from "../services/getFcmToken";
import { saveFcmToken } from "../hook/Fcmtoken";

export async function Notificationpermission() {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getFcmToken();
   
      if (token) {
        await saveFcmToken(token);
      }

      return true;
    }
    console.log("tell",permission)

    return false;
  } catch (error) {
    console.error("Notification permission error:", error);
    return false;
  }
}