const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 60 * 60 * 1000, // Set expiration time to 1 hour from creation
      expires: 0,
    },
  },
  { timestamps: true }
);

const emailTokenModel = mongoose.model("emailToken", tokenSchema);

// Create TTL index
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = emailTokenModel;


