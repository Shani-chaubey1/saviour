import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, default: '' },
  project: { type: String, default: '' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  source: { type: String, default: 'website' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
