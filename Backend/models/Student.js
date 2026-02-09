const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  registerNo: { type: String, required: true, index: true },
  name: { type: String, required: true },
  gender: { type: String },

  college: { type: String, default: 'VCET' },
  department: { type: String },

  dob_ddMmmYyyy: { type: String },
  dob_ddMmYyyy: { type: String },

  motherTongue: { type: String },
  yearOfGraduation: { type: Number },
  batch: { type: String, required: true }, // e.g. "2022-2026"

  mobile1: { type: String },
  mobile2: { type: String },
  primaryEmail: { type: String },
  alternateEmail: { type: String },

  xPercentage: { type: Number },
  xiiPercentage: { type: Number },
  diplomaPercentage: { type: Number },
  cgpa: { type: Number },

  standingArrears: { type: Number, default: 0 },
  historyOfArrears: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
