import mongoose from 'mongoose';

const FloorPlanSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: String },
});

const PriceRowSchema = new mongoose.Schema({
  type: { type: String },
  size: { type: String },
  price: { type: String },
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  rera: { type: String, default: '' },
  configuration: { type: String, default: '' },
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyType' },
  typeName: { type: String, default: '' },
  address: { type: String, default: '' },
  location: { type: String, default: '' },
  status: {
    type: String,
    enum: ['For Sale', 'Sold Out', 'Upcoming', 'Possession Soon', 'Under Construction', 'Ready to Move'],
    default: 'For Sale',
  },
  price: { type: String, default: '' },
  area: { type: String, default: '' },
  pricePerSqft: { type: String, default: '' },
  badge: { type: String, default: '' },
  excerpt: { type: String, default: '' },
  overview: { type: String, default: '' }, // HTML from Jodit
  thumbnail: { type: String, default: '' },
  gallery: [{ type: String }],
  floorPlans: [FloorPlanSchema],
  masterPlan: { type: String, default: '' },
  video: { type: String, default: '' },
  amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
  specifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Specification' }],
  highlights: [{ type: String }],
  priceTable: [PriceRowSchema],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  // Manual sort key. Lower values appear first; equal/missing values fall
  // back to createdAt DESC so existing rows keep their current ordering.
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProjectSchema.pre('save', function () {
  this.updatedAt = new Date();
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
