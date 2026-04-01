import mongoose from "mongoose";

/**
 * Token blacklist for logout invalidation.
 * When user logs out, token is stored until it expires.
 */
const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema);
