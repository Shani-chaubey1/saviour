import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' }, // HTML from Jodit
  thumbnail: { type: String, default: '' },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  author: { type: String, default: 'Admin' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PostSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
