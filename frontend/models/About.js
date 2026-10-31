import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'sheikh', unique: true }, // only one About document
    nameOromo: String,
    nameArabic: String,
    photoUrl: String,
    biographyOromo: String,
    biographyArabic: String,
    education: [String],
    works: [String],
    timeline: [{ _id: false, year: String, text: String }],
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model('About', aboutSchema);