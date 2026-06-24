const Task = require('../models/Task');

const VALID_PRIORITIES = ['low', 'medium', 'high'];
const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

/**
 * GET /api/tasks
 * Optional query params: status, priority
 */
async function getTasks(req, res) {
  try {
    const filter = { user: req.user.id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter).sort({ dueDate: 1 }).lean();
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
}

/**
 * GET /api/tasks/:id
 */
async function getTask(req, res) {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id }).lean();
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ message: 'Failed to fetch task' });
  }
}

/**
 * POST /api/tasks
 * Body: { title, description, dueDate, priority, status }
 */
async function createTask(req, res) {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: 'title and dueDate are required' });
    }
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: `priority must be one of ${VALID_PRIORITIES.join(', ')}` });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${VALID_STATUSES.join(', ')}` });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user.id,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Failed to create task' });
  }
}

/**
 * PATCH /api/tasks/:id
 * Body: any subset of { title, description, dueDate, priority, status }
 */
async function updateTask(req, res) {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: `priority must be one of ${VALID_PRIORITIES.join(', ')}` });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${VALID_STATUSES.join(', ')}` });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Failed to update task' });
  }
}

/**
 * DELETE /api/tasks/:id
 */
async function deleteTask(req, res) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task deleted', id: req.params.id });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Failed to delete task' });
  }
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };