import mongoose from 'mongoose';

const AmenitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  icon: { type: String, default: 'FaCheck' }, // react-icons component name
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Amenity || mongoose.model('Amenity', AmenitySchema);
