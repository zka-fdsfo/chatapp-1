import { Fcmtokenget } from "../services/auth.api";

export const saveFcmToken = async (token) => {
  try {
    console.log("saving token:", token);
    // const response = await Fcmtokenget(token);
    return response;
  } catch (error) {
    console.error("Failed to save FCM token:", error);
  }
};