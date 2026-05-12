import mongoose from 'mongoose';

const SpecificationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  icon: { type: String, default: 'FaCheck' }, // react-icons component name
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Specification || mongoose.model('Specification', SpecificationSchema);
