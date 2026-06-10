require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const PLACEHOLDER_VIDEO = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saviourgroup';
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({}, { strict: false }));

  const result = await Project.updateMany(
    { video: PLACEHOLDER_VIDEO },
    { $set: { video: '' } }
  );

  console.log(`🧹 Cleared placeholder video from ${result.modifiedCount} project(s).`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
