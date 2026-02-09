const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true, collection: 'Staff' });

module.exports = mongoose.model('Staff', staffSchema);
