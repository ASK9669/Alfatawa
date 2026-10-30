import mongoose from 'mongoose';

const categories = [
  { nameOromo: 'Ibadaa', slug: 'ibadaa' },
  { nameOromo: "Mu'amalaa", slug: 'muamalaa' },
  { nameOromo: 'Maatii', slug: 'maatii' },
];

await mongoose.connect(process.env.MONGODB_URI);

const Category =
  mongoose.models.Category ||
  mongoose.model(
    'Category',
    new mongoose.Schema({
      nameOromo: String,
      nameArabic: String,
      slug: { type: String, unique: true },
    })
  );

for (const c of categories) {
  await Category.updateOne({ slug: c.slug }, { $set: c }, { upsert: true });
}
console.log('Categories saved:', categories.length);
await mongoose.disconnect();