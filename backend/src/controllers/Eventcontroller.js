const Event = require('../models/Event');

const VALID_TYPES = ['deadline', 'study-session', 'event'];

/**
 * GET /api/events
 */
async function getEvents(req, res) {
  try {
    const events = await Event.find({ user: req.user.id }).sort({ date: 1 }).lean();
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Failed to fetch events' });
  }
}

/**
 * GET /api/events/:id
 */
async function getEvent(req, res) {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user.id }).lean();
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({ message: 'Failed to fetch event' });
  }
}

/**
 * POST /api/events
 * Body: { title, date, type }
 */
async function createEvent(req, res) {
  try {
    const { title, date, type } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'title and date are required' });
    }
    if (type && !VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: `type must be one of ${VALID_TYPES.join(', ')}` });
    }

    const event = await Event.create({ title, date, type, user: req.user.id });
    return res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ message: 'Failed to create event' });
  }
}

/**
 * PATCH /api/events/:id
 * Body: any subset of { title, date, type }
 */
async function updateEvent(req, res) {
  try {
    const { title, date, type } = req.body;

    if (type && !VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: `type must be one of ${VALID_TYPES.join(', ')}` });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (date !== undefined) updates.date = date;
    if (type !== undefined) updates.type = type;

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ message: 'Failed to update event' });
  }
}

/**
 * DELETE /api/events/:id
 */
async function deleteEvent(req, res) {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json({ message: 'Event deleted', id: req.params.id });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ message: 'Failed to delete event' });
  }
}

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent };