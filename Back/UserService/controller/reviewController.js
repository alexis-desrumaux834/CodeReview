import express from "express";
import _ from "lodash";
import {checkJwt} from "../store/middleware";
import {Review, Comment, Profile} from "../database/models";
import {validateReviewCreation, validateReviewUpdate} from "../store/validators";
import jwt from "jsonwebtoken";
import {config} from "../store/config";

const ReviewController = express.Router();

ReviewController.get('/' , checkJwt, async (req, res) => {
    const decoded = jwt.verify(req.token, config.dev.publicKEY);
    const reviews = await Review.find({});
    const profile = await Profile.findOne({userId: decoded._id});
    let finalReviews = []

    if (profile) {
        if (reviews) {
            for (const index in reviews) {
                let missingSkills = [];
                const skillsNeeded = reviews[index].objectives.concat(reviews[index].skillsNeeded);

                skillsNeeded.forEach((skill)=>{
                    if (!profile.skills.includes(skill))
                        missingSkills.push(skill)
                })
                if (missingSkills.length === 0) {
                    console.log('OK');
                    finalReviews.push(reviews[index])
                } else
                    console.log('NON');
            }
            res.status(200).json(finalReviews);
        } else
            res.status(500).json({message: "No reviews found"});
    } else
        res.status(400).json({message: "User don't have profile"});
});

ReviewController.get('/all' , checkJwt, async (req, res) => {
    const review = await Review.find({});

    if (review)
        res.status(200).json(review);
    else
        res.status(500).json({message: "No reviews found"});
});

ReviewController.get('/:id', checkJwt, async (req, res) => {
    const review = await Review.findOne({_id: req.params.id});
    let reviewFinal = _.pick(review, [
        '_id', 'userId', 'name', 'description', 'repoUrl', 'status', 'objectives', 'skillsNeeded', 'createdAt', 'updatedAt']);
    const comments = await Comment.find({reviewId: req.params.id});

    if (reviewFinal) {
        reviewFinal.comments = comments;
        res.status(200).json(reviewFinal);
    } else
        res.status(500).json({message: "This review hasn't been found"});
});

ReviewController.get('/all/:userId', checkJwt, async (req, res) => {
    const review = await Review.find({userId: req.params.userId});

    if (review)
        res.status(200).json(review);
    else
        res.status(500).json({message: "No review found for this user"});
});

ReviewController.post('/', checkJwt, async (req, res) => {
    const { error } = validateReviewCreation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    const exist = await Review.findOne({name: req.body.name, userId: req.body.userId})

    if (exist)
        return res.status(403).json({message: "You already have a review with this name"})

    const doc = _.pick(req.body, ['userId','name','description','repoUrl', 'status', 'objectives', 'skillsNeeded', 'thumbnail']);

    const review = await Review.create(doc);
    res.status(201).send(review);
});

ReviewController.put('/:id', checkJwt, async (req, res) => {
    const { error } = validateReviewUpdate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    const myReview = await Review.findOne({_id: req.params.id});

    if (!myReview)
        return res.status(400).json({ message: "This review doesn't exist" });

    if (req.body.name) {
        const exist = await Review.findOne({name: req.body.name, userId: myReview.userId})

        if (exist)
            return res.status(403).json({message: "You already have a review with this name"})
    }

    Review.findOneAndUpdate({_id: req.params.id}, req.body, (err) => {
        if (err)
            return res.status(403).json({error: 'Update couldn\'t be proceed'})
        return res.status(200).json({success: 'Updated!'})
    })
});

ReviewController.delete('/:id', checkJwt, async (req, res) => {
    Review.deleteOne({_id: req.params.id})
        .then(()=> {
            res.status(200).json({ message: 'Review deleted !' });
        })
        .catch( (error) => {
            res.status(400).json({ error: error });
        });
});

export default ReviewController;
