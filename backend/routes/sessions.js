const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const StudySession = require('../models/StudySession');
const User = require('../models/User');

// POST /api/sessions — Create a new session
router.post('/', protect, async (req, res) => {
  try {
    const { subject, goalMinutes } = req.body;
    if (!subject || !goalMinutes)
      return res.status(400).json({ message: 'Subject and goal minutes are required.' });

    const session = await StudySession.create({
      user: req.user._id,
      subject,
      goalMinutes,
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/sessions — Get all sessions for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const sessions = await StudySession.find(filter)
      .sort({ startedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StudySession.countDocuments(filter);
    res.json({ sessions, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/sessions/:id — Get single session
router.get('/:id', protect, async (req, res) => {
  try {
    const session = await StudySession.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/sessions/:id/complete — Mark session as completed with results
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const { focusedSeconds, distractions, focusScore, notes } = req.body;
    const session = await StudySession.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    session.focusedSeconds = focusedSeconds || 0;
    session.distractions = distractions || [];
    session.focusScore = focusScore || 0;
    session.notes = notes || '';
    session.status = 'completed';
    session.endedAt = new Date();
    await session.save();

    // Update user's total study time and streak
    const user = await User.findById(req.user._id);
    user.totalStudyMinutes += Math.floor(focusedSeconds / 60);
    const today = new Date().toDateString();
    const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastStudy === yesterday) user.streak += 1;
    else if (lastStudy !== today) user.streak = 1;
    user.lastStudyDate = new Date();
    await user.save();

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/sessions/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const session = await StudySession.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    res.json({ message: 'Session deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
