const mongoose = require("mongoose");

const reportModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: [true, "Please provide the reporter's ID"],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Please provide the property owner's ID"],
    },
    reason: {
      type: String,
      enum: ["scam", "fake post"],
      required: [true, "Please provide a report reason"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please provide a description"],
    },
    userPhoneNumber: {
      type: String,
      trim: true,
      required: [true, "Please provide a phone number"],
    },
    status: {
      type: String,
      enum: ["settled", "in progress"],
      default: "in progress",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reportschema", reportModel);
