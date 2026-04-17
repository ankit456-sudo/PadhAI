const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const StudySession = require('../models/StudySession');

// GET /api/analytics/summary — Overall stats for the user
router.get('/summary', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await StudySession.find({ user: userId, status: 'completed' });

    const totalSessions = sessions.length;
    const totalFocusedSeconds = sessions.reduce((sum, s) => sum + s.focusedSeconds, 0);
    const totalDistractions = sessions.reduce((sum, s) => sum + s.distractions.length, 0);
    const avgFocusScore =
      totalSessions > 0
        ? Math.round(sessions.reduce((sum, s) => sum + s.focusScore, 0) / totalSessions)
        : 0;

    // Best session
    const bestSession = sessions.reduce(
      (best, s) => (s.focusScore > (best?.focusScore || 0) ? s : best),
      null
    );

    // Distraction breakdown
    const distractionBreakdown = {};
    sessions.forEach((s) => {
      s.distractions.forEach((d) => {
        distractionBreakdown[d.type] = (distractionBreakdown[d.type] || 0) + 1;
      });
    });

    res.json({
      totalSessions,
      totalFocusedMinutes: Math.floor(totalFocusedSeconds / 60),
      totalDistractions,
      avgFocusScore,
      bestSession: bestSession
        ? { subject: bestSession.subject, focusScore: bestSession.focusScore, date: bestSession.startedAt }
        : null,
      distractionBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/analytics/weekly — Last 7 days breakdown
router.get('/weekly', protect, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sessions = await StudySession.find({
      user: req.user._id,
      status: 'completed',
      startedAt: { $gte: sevenDaysAgo },
    });

    // Group by day
    const days = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toDateString();
      days[d] = { date: d, focusedMinutes: 0, sessions: 0, avgScore: 0, scores: [] };
    }

    sessions.forEach((s) => {
      const day = new Date(s.startedAt).toDateString();
      if (days[day]) {
        days[day].focusedMinutes += Math.floor(s.focusedSeconds / 60);
        days[day].sessions += 1;
        days[day].scores.push(s.focusScore);
      }
    });

    const result = Object.values(days).map((d) => ({
      ...d,
      avgScore: d.scores.length ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length) : 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/analytics/subjects — Study time per subject
router.get('/subjects', protect, async (req, res) => {
  try {
    const data = await StudySession.aggregate([
      { $match: { user: req.user._id, status: 'completed' } },
      {
        $group: {
          _id: '$subject',
          totalMinutes: { $sum: { $divide: ['$focusedSeconds', 60] } },
          sessions: { $sum: 1 },
          avgScore: { $avg: '$focusScore' },
        },
      },
      { $sort: { totalMinutes: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
