import mongoose from 'mongoose';

const fatwaSchema = new mongoose.Schema(
  {
    number: { type: Number, unique: true, sparse: true },
    slug: { type: String, unique: true, sparse: true },
    titleOromo: String,
    titleArabic: String,
    questionOromo: { type: String, required: true, maxlength: 2000 },
    answerOromo: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    youtubeUrl: String,
    status: {
      type: String,
      enum: ['Pending', 'Draft', 'Published', 'Rejected'],
      default: 'Pending',
    },
    askerEmail: { type: String, select: false },
    notifyAsker: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Fatwa || mongoose.model('Fatwa', fatwaSchema);