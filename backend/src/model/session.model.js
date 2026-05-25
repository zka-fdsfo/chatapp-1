import mongoose  from "mongoose";

const sessionSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    valid: {
        type: Boolean,
        default: false,
    },

},{timestamps: true })

const Session = mongoose.model("Session", sessionSchema)    

export default Session