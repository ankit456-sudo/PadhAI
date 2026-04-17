const mongoose = require('mongoose');

const DistractionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['phone_detected', 'face_away', 'talking', 'absent', 'multiple_people'],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const StudySessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    goalMinutes: { type: Number, required: true },
    focusedSeconds: { type: Number, default: 0 },
    distractions: [DistractionSchema],
    focusScore: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Virtual: focused minutes
StudySessionSchema.virtual('focusedMinutes').get(function () {
  return Math.floor(this.focusedSeconds / 60);
});

// Virtual: completion percentage
StudySessionSchema.virtual('completionPercent').get(function () {
  return Math.min(100, Math.round((this.focusedSeconds / 60 / this.goalMinutes) * 100));
});

StudySessionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('StudySession', StudySessionSchema);
