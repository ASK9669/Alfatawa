import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});

// MongoDB deletes each record by itself once expiresAt has passed
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RateLimit || mongoose.model('RateLimit', rateLimitSchema);