
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

  //  console.log("tell",permission)

    return false;
  } catch (error) {
    console.error("Notification permission error:", error);
    return false;
  }
}

let audioInstance = null;

let audioUnlocked = false;

export function unlockAudio() {
  if (audioUnlocked) return;

  const audio = new Audio("/sound/mixkit-software-interface-start-2574.wav");

  audio.play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;

      audioUnlocked = true;

      // console.log("🔊 Audio unlocked");
    })
    .catch((err) => {
      console.log("❌ Audio unlock failed:", err);
    });
}