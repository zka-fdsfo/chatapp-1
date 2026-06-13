import mongoose from "mongoose";

const Schemauser = new mongoose.Schema({
    name: {
    type: String,
    required: true,
  },
    email: {
    type: String,
    required: true,
    unique: true,
    },
    password: {
    type: String,
    required: true,
    },
    avatar: {
    type: String,
    },  
    bio: {
    type: String,
    },
    firebaseUid: {
  type: String,
  default: null,
},

isGoogleUser: {
  type: Boolean,
  default: false,
},
  fcmToken: {
    type: String,
    default: null,
  },
},{ timestamps: true });

const User = mongoose.model("User", Schemauser);

export default User;