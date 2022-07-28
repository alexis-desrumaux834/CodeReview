import { Schema } from 'mongoose';

const reviewSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 25
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 99999
    },
    repoUrl: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 99999
    },
    status: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 99999
    },
    objectives: {
        type: [String],
        default: [],
    },
    skillsNeeded: {
        type: [String],
        default: [],
    },
    reviewers: {
        type: [String],
        default: [],
    },
    thumbnail: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 99999
    }
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

export default reviewSchema;