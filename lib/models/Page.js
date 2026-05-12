import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  sections: { type: mongoose.Schema.Types.Mixed, default: {} }, // JSON object of page sections
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

PageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Page || mongoose.model('Page', PageSchema);
