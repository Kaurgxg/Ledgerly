const Feedback = require('../models/Feedback');

// @route GET /api/feedback
// @desc  Regular users get their own submissions; admins get everyone's (optional ?status=open|resolved)
async function getFeedback(req, res, next) {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    if (req.query.status && ['open', 'resolved'].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    const items = await Feedback.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
}

async function submitFeedback(req, res, next) {
  try {
    const { category = 'Feedback', subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ message: 'Subject and message are required.' });

    const item = await Feedback.create({
      user: req.user._id,
      name: req.user.name,
      username: req.user.username,
      category,
      subject,
      message,
      status: 'open',
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
}

// @route PATCH /api/feedback/:id/reply  (admin only)
async function replyFeedback(req, res, next) {
  try {
    const { reply, resolve } = req.body;
    const item = await Feedback.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Feedback not found.' });

    if (reply !== undefined) item.adminReply = reply;
    if (resolve) item.status = 'resolved';
    item.repliedAt = new Date();
    await item.save();
    res.json(item);
  } catch (err) { next(err); }
}

// @route PATCH /api/feedback/:id/reopen (admin only)
async function reopenFeedback(req, res, next) {
  try {
    const item = await Feedback.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Feedback not found.' });
    item.status = 'open';
    await item.save();
    res.json(item);
  } catch (err) { next(err); }
}

module.exports = { getFeedback, submitFeedback, replyFeedback, reopenFeedback };
