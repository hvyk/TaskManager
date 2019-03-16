const express = require('express');

const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail } = require('../emails/account')

const router = new express.Router();



// Create a new user
router.post('/users', async (req, rsp) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    rsp.status(201).send({ user, token });
  } catch (error) {
    rsp.status(400).send(error);
  }

});

router.post('/users/login', async (req, rsp) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    rsp.send({ user, token });
  } catch (error) {
    rsp.status(400).send(); 
  }
});


router.post('/users/logout', auth, async(req, rsp) => {
  
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return (token.token !== req.token);
    });
    await req.user.save();

    rsp.send();
  } catch (error) {
    rsp.status(500).send()
  }
});

router.post('/users/logoutall', auth, async(req, rsp) => {
  
  try {
    req.user.tokens = [];
    await req.user.save();
    rsp.send({ message: 'Success?!?'});
  } catch (error) {
    rsp.status(500).send({error: error});
  }
});
 
// Get all Users
// Requires authentication
router.get('/users/me', auth, async (req, rsp) => {
  rsp.send(req.user);
});

// Get users by ID
router.get('/users/:id', async (req, rsp) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    console.log(user);
    if (!user) {
      return rsp.status(404).send();
    }
    rsp.status(200).send(user)
  } catch (error) {
    rsp.status(404).send(error);
  }
});

// Update user
router.patch('/users/me', auth, async (req, rsp) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'passowrd', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  
  if (!isValidOperation) {
    return rsp.status(400).send({ error: 'Invalid fields updated' });
  }

  try {
    if (!req.user) {
      return rsp.status(404).send();
    }

    updates.forEach((key) => req.user[key] = req.body[key]);
    req.user.save();
    rsp.send(req.user);
  } catch (error) {
    rsp.status(400).send();
  }
});

router.delete('/users/me', auth, async (req, rsp) => {
  try {
    await req.user.remove();
    rsp.send(req.user);
  } catch (error) {
    rsp.status(500).send(error);
  }
});




module.exports = router;