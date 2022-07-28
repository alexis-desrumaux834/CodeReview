import { Schema } from 'mongoose';

const profileSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: "Undefined"
  },
  surname: {
    type: String,
    default: "Undefined"
  },
  age: {
    type: Number
  },
  skills: {
    type: [String],
    default: [],
  }
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

export default profileSchema;