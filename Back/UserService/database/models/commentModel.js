import mongoose from 'mongoose';
import commentSchema from "../schemas/commentSchema";

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;