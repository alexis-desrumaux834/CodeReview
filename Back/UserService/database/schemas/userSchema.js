import { Schema } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 99999,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  role: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10
  },
  claimUsers: {
    type: [String],
    default: [],
},
  access_token: {
    type: String,
    required: false,
    minlength: 64,
    maxlength: 64
  },
  refresh_token: {
    type: String,
    required: false,
    minlength: 64,
    maxlength: 64
  },
  gitlabId: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 12
  }
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}})

export default userSchema;