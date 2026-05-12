import mongoose from 'mongoose';

const PropertyTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PropertyType || mongoose.model('PropertyType', PropertyTypeSchema);
