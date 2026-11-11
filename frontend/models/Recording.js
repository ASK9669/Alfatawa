import mongoose from "mongoose";

const recordingSchema = new mongoose.Schema(
  {
    fatwa: { type: mongoose.Schema.Types.ObjectId, ref: "Fatwa", index: true },
    data: { type: Buffer, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    seconds: { type: Number, default: 0 },
    deleteAt: Date,
  },
  { timestamps: true },
);

// MongoDB deletes a recording by itself once deleteAt has passed
recordingSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Recording ||
  mongoose.model("Recording", recordingSchema);
