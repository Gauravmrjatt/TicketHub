import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const EventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Event name is required"],
    trim: true,
    maxlength: [100, "Event name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  date: {
    type: Date,
    required: [true, "Event date is required"],
  },
  venue: {
    type: String,
    trim: true,
    maxlength: [200, "Venue cannot exceed 200 characters"],
  },
  image: {
    type: String, // Base64 encoded image
  },
  price: {
    type: Number,
    default: 0,
    min: [0, "Price cannot be negative"],
  },
  capacity: {
    type: Number,
    default: 0, // 0 means unlimited
    min: [0, "Capacity cannot be negative"],
  },
  password: {
    type: String,
    required: [true, "Admin password is required"],
    minlength: [4, "Password must be at least 4 characters"],
  },
  upiAddress: {
    type: String,
    trim: true,
  },
  qrCodeImage: {
    type: String, // Base64 encoded QR image
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
  },
  ticketsSold: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
EventSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
EventSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate unique event ID
EventSchema.statics.generateEventId = function () {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
