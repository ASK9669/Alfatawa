import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  nameOromo: { type: String, required: true },
  nameArabic: String,
  slug: { type: String, required: true, unique: true },
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);