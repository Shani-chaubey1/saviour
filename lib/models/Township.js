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

export default mongoose.models.Township || mongoose.model('Township', TownshipSchema);
