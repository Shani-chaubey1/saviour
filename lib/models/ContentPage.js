import mongoose from 'mongoose';

const ContentPageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  bannerImage: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  showInFooter: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  // When true, the public page appends a Projects section filtered by
  // `projectsLocation`. Same filter semantics as /projects?location=…
  showProjects: { type: Boolean, default: false },
  projectsLocation: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ContentPageSchema.pre('save', function () {
  this.updatedAt = new Date();
});

ContentPageSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

export default mongoose.models.ContentPage ||
  mongoose.model('ContentPage', ContentPageSchema);
