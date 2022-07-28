import mongoose from 'mongoose';
import reviewSchema from "../schemas/reviewSchema";

const Review = mongoose.model('Review', reviewSchema);

export default Review;