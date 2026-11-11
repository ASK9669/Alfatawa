import mongoose from 'mongoose';

const fatwaSchema = new mongoose.Schema(
  {
    number: { type: Number, unique: true, sparse: true },
    slug: { type: String, unique: true, sparse: true },
    titleOromo: String,
    titleArabic: String,
    // a voice question may have no typed text; it needs text before it can be published
    questionOromo: {
      type: String,
      maxlength: 2000,
      required: function () {
        return !this.audio;
      },
    },
    answerOromo: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    youtubeUrl: String,
    audio: { type: mongoose.Schema.Types.ObjectId, ref: 'Recording' },
    audioSeconds: Number,
    status: {
      type: String,
      enum: ['Pending', 'Draft', 'Published', 'Rejected'],
      default: 'Pending',
    },
    askerEmail: { type: String, select: false },
    notifyAsker: { type: Boolean, default: false },
    notifiedAt: Date,
    publishedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Fatwa || mongoose.model('Fatwa', fatwaSchema);