import express from "express";
import jwt from "jsonwebtoken";
import _ from "lodash";

import { Comment, User } from "../database/models";
import { checkJwt } from "../store/middleware";
import { validateCommentCreation, validateCommentUpdate } from "../store/validators"
import { config } from "../store/config";


const CommentController = express.Router();

CommentController.get('/' , checkJwt, async (req, res) => {
    const comment = await Comment.find({});

    if (comment)
        res.status(200).json(comment);
    else
        res.status(500).json({message: "No comments found"});
});

CommentController.get('/user/:userId', checkJwt, async (req, res) => {
    const comment = await Comment.find({ownerId: req.params.userId});

    if (comment)
        res.status(200).json(comment);
    else
        res.status(500).json({message: "No comment found for this user"});
});

CommentController.get('/:commentId', checkJwt, async (req, res) => {
    const comment = await Comment.find({_id: req.params.commentId});

    if (comment)
        res.status(200).json(comment);
    else
        res.status(500).json({message: "No comment found for this id"});
});

CommentController.post('/', checkJwt, async (req, res) => {
    const { error } = validateCommentCreation(req.body);
    // Ajout des validators plus souple (plus de 99999) / ajout de restriction sur qui peut modifier quoi sur les routes owner ou admin pour le put

    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    const usertoken = req.headers.authorization;

    if (usertoken) {
        const token = usertoken.split(' ');
        try {
            const decoded = jwt.verify(token[1], config.dev.publicKEY);
            let user = await User.findOne({_id: decoded._id});

            if (user) {
                const doc = _.pick(req.body, ['comment','lineSuggestion','lineContent','line', 'fileName', 'language', 'reviewId']);

                doc.ownerId = user._id;
                const comment = await Comment.create(doc);
                res.status(201).send(comment);
            } else {
                return res.status(403).json({error: 'You need to be logged to perfom this action'});
            }
        } catch (error) {
            return res.status(403).json({error: 'You need to be logged to perfom this action'});
        }
    }

});

CommentController.put('/:commentId', checkJwt, async (req, res) => {
    const { error } = validateCommentUpdate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    Comment.findOneAndUpdate({_id: req.params.commentId}, req.body, (err) => {
        if (err)
            return res.status(403).json({error: 'Update couldn\'t be proceed'})
        return res.status(200).json({success: 'Updated!'})
    })
});

CommentController.delete('/:commentId', checkJwt, async (req, res) => {
    Comment.deleteOne({_id: req.params.commentId})
        .then(()=> {
            res.status(200).json({ message: 'Comment deleted !' });
        })
        .catch( (error) => {
            res.status(400).json({ error: error });
        });
});

export default CommentController;
