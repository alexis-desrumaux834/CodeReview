import { Schema } from 'mongoose';

const commentSchema = new Schema({
    ownerId: {
        type: String,
        required: true
    },
    reviewId: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 25
    },
    line: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 25
    },
    lineContent: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 99999
    },
    lineSuggestion: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 99999
    },
    comment: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 99999
    },
    language: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 25
    },
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

export default commentSchema;