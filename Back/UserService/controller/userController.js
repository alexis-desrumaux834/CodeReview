import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";

import { User } from "../database/models";
import {
    checkJwt,
    ParamsUserCheck,
} from "../store/middleware";
import { validateUpdateUser } from "../store/validators";
import { config } from "../store/config";

const UserController = express.Router();

UserController.get('/' , checkJwt, async (req, res) => {
    User.find({}, function(err, users) {
        let userMap = [];

        users.forEach((user) => {
            const noPasswordUser = _.pick(user, [
                '_id', 'username','email','role', 'access_token', 'gitlabId',
                'refresh_token','createdAt', 'updatedAt']);
            userMap.push(noPasswordUser);
        });
        res.status(200).send(userMap);
    });
});

UserController.get('/info/me', checkJwt, async (req, res) => {
    const usertoken = req.headers.authorization;

    if (usertoken) {
        const token = usertoken.split(' ');
        try {
            const decoded = jwt.verify(token[1], config.dev.publicKEY);
            let profile = await User.findOne({_id: decoded._id});

            if (profile) {
                res.status(200).json(profile);
            } else {
                return res.status(500).json({message: "No profile found"});
            }
        } catch (error) {
            return res.status(403).json({error: 'You are not allowed to perform this action'});
        }
    } else {
        return res.status(401).json({error: 'You need to be logged in to proceed'});
    }
});

UserController.get('/:id', checkJwt, ParamsUserCheck, async (req, res) => {
    let user = await User.findOne({ _id: req.params.id });

    if (user) {
        const noPasswordUser = _.pick(user, [
            '_id', 'username','email','role', 'stripeId', 'gitlabId',
            'access_token', 'refresh_token', 'createdAt', 'updatedAt']);

        res.send(noPasswordUser);
    } else
        res.status(404).json({error: "User not found"});
});

UserController.put('/:id', checkJwt, ParamsUserCheck, async (req, res)=> {
    const token = req.token;

    const { error } = validateUpdateUser(req.body);
    if (error) {
        return res.status(403).json({ error: error.details[0].message});
    }

    try {
        const decoded = jwt.verify(token, config.dev.publicKEY);
        const salt = await bcrypt.genSalt(10);

        let user = await User.findOne({_id: decoded._id});

        const newBody = req.body;

        if (req.body.role && user.role !== "admin")
            delete newBody.role
        if (newBody.password)
            newBody.password = await bcrypt.hash(newBody.password, salt)

        User.findByIdAndUpdate(req.params.id, newBody, (err, user) => {
            if (err)
                return res.status(403).json({error: 'Update couldn\'t be proceed'})
            return res.status(200).json({success: 'Updated!'})
        })
    } catch {
        return res.status(403).json({error: 'You need to be logged as an admin or request for your profil '});
    }
});

UserController.delete('/:id', checkJwt, ParamsUserCheck, async (req, res) => {
    User.deleteOne({_id: req.params.id})
        .then(()=> {
            res.status(200).json({ message: 'User deleted !' });
        })
        .catch( (error) => {
            res.status(400).json({ error: error });
        });
});

export default UserController;