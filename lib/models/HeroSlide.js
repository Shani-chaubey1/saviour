import mongoose from 'mongoose';

/**
 * HeroSlide — a banner image in the homepage hero slider at the very top.
 * Managed independently of projects so admins can curate the slider directly.
 */
const HeroSlideSchema = new mongoose.Schema({
  image: { type: String, required: true, trim: true },
  // Optional caption text (also used as the image alt for accessibility).
  title: { type: String, default: '', trim: true },
  // Optional redirection URL — makes the slide clickable when set.
  link: { type: String, default: '', trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// If a cached model exists but its compiled schema is missing the `image`
// field (i.e. it was registered before this field was added), delete it so a
// fresh model with the complete schema is created. This survives both cold
// starts and hot-reload cycles in Next.js dev mode.
if (mongoose.models.HeroSlide && !mongoose.models.HeroSlide.schema.paths.image) {
  mongoose.deleteModel('HeroSlide');
}

export default mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);
