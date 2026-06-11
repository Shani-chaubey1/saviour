import mongoose from 'mongoose';

/**
 * Township — a card in the "Our Presence in Leading Townships" homepage section.
 * Each entry shows the township/area name, the city/location subtitle,
 * a hero image, and a redirection URL.
 */
const TownshipSchema = new mongoose.Schema({
  area: { type: String, required: true, trim: true },
  city: { type: String, default: '', trim: true },
  // Two optional highlight lines shown above the area name on the card.
  line1: { type: String, default: '', trim: true },
  line2: { type: String, default: '', trim: true },
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// If a cached model exists but its compiled schema is missing the `line1`
// field (i.e. it was registered before this field was added), delete it so a
// fresh model with the complete schema is created. This survives both cold
// starts and hot-reload cycles in Next.js dev mode.
if (mongoose.models.Township && !mongoose.models.Township.schema.paths.line1) {
  mongoose.deleteModel('Township');
}

export default mongoose.models.Township || mongoose.model('Township', TownshipSchema);
