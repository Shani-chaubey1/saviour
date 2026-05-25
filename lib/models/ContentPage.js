import mongoose from 'mongoose';

const ContentPageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  showInFooter: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ContentPageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

ContentPageSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export default mongoose.models.ContentPage ||
  mongoose.model('ContentPage', ContentPageSchema);
