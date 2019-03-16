const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

// A Mongoose ‘schema’ is a document data structure (or shape of the document)
// that is enforced via the application layer.
//
// Schemas also define document 
//    - instance methods
//    - static Model methods
//    - compound indexes
//    - document lifecycle hooks called middleware.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Provided email is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot be "password"');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be > 0');
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});


userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}


userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  
  if (!user) {
    throw new Error('Unable to find user by email!');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Incorrect password');
  }

  return user;
}

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

  next()
}, {
  timestamp: true
});


// userSchema.virtual('tasks', {
//   ref: 'Task',
//   localField: '_id',      // name of field on this thing   
//   foreignField: 'owner'   // name of field on other thing
// })

// const main = async () => {
//   // const task = await Task.findById(id);
//   // Populate field
//   // await task.populate('owner').execPopulate()
//   // console.log(task.owner);

//   const user = await user.findById(id);
//   // Populate virtual field
//   await user.populate('tasks').execPopulate();
//   console.log(user.tasks);

// }


const User = mongoose.model('User', userSchema);

module.exports = User;