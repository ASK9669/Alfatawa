import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema(
  {
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    number: { type: Number, required: true },
    titleOromo: { type: String, required: true, maxlength: 150 },
    youtubeId: { type: String, required: true },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// a program can never have two parts with the same number
episodeSchema.index({ program: 1, number: 1 }, { unique: true });

export default mongoose.models.Episode || mongoose.model('Episode', episodeSchema);