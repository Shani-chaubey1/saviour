import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, default: '', lowercase: true, trim: true },
  phone: { type: String, default: '' },
  project: { type: String, default: '' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  source: { type: String, default: 'website' },
  formType: { type: String, enum: ['connect', 'visit'], default: 'connect' },
  preferredDateTime: { type: Date, default: null },
  visitDate: { type: String, default: '' },
  visitTime: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
