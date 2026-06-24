import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,

  email: {
    type: String,
    unique: true,
  },

  password: String,

  role: {
    type: String,
    enum: [
      "Worker",
      "Supervisor",
      "Engineer",
      "Contractor",
      "Admin",
    ],
  },

  skills: [String],

  profileImage: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);