import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: String, // we use one counter named 'fatwa'
  seq: { type: Number, default: 0 },
});

export default mongoose.models.Counter || mongoose.model('Counter', counterSchema);