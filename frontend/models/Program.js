import mongoose from 'mongoose';

const programSchema = new mongoose.Schema(
  {
    titleOromo: { type: String, required: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true },
    descriptionOromo: { type: String, maxlength: 2000 },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Program || mongoose.model('Program', programSchema);