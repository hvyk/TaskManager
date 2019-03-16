const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();


// Create a new task
router.post('/tasks', auth, async (req, rsp) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    rsp.send(task);
  } catch (error) {
    rsp.status(500).send(error);
  }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, rsp) => {
  try {
    const match = {};
    const sort = {};

    if (req.query.completed) {
      match.completed = (req.query.completed === 'true');
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = (parts[1] === 'desc') ? -1 : 1;
    }

    // const tasks = await Task.find({ owner: req.user._id });
    // rsp.status(200).send(tasks);
    // Using virtual fields
    await req.user.populate({
      path: 'tasks',
      match: match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort: sort
      }
    }).execPopulate();

    rsp.send(req.user.tasks);
  } catch (error) {
    rsp.status(500).send(error);
  }
});

router.get('/tasks/:id', auth, async (req, rsp) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return rsp.status(404).send();
    }

    rsp.status(200).send(task);
  } catch (error) {
    rsp.status(500).send(error);
  }
});

// Patch
router.patch('/tasks/:id', auth, async (req, rsp) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  
  if (!isValidOperation) {
    return rsp.status(400).send({ error: 'Invalid fields updated' });
  }

  try {
    // const task = await Task.findById(req.params.id, { owner: req.user._id});
    const task = await Task.findById(req.params.id);

    if (!task) {
      return rsp.status(404).send();
    }

    updates.forEach((key) => task[key] = req.body[key]);
    task.save();

    rsp.send(task);
  } catch (error) {
    rsp.status(400).send();
  }
});

router.delete('/tasks/:id', auth, async (req, rsp) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOne(req.params.id, { owner: req.user._id })

    if (!task) {
      return rsp.status(404).send();
    }
    rsp.send(task);
  } catch (error) {
    rsp.status(500).send(error);
  }
});

module.exports = router;