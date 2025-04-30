import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // User's email
  password: { type: String, required: true }, // User's password
  avatarUrl: { type: String, default: "/uploads/default_avatar.png" }, // Default avatar
  userId: { type: String, required: true, unique: true }, // Unique user identifier
  createdAt: { type: Date, default: Date.now }, // Timestamp for user creation
});

export default mongoose.models.User || mongoose.model("User", UserSchema);