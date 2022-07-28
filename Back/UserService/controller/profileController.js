import express from "express";
import _ from "lodash";

import { Profile } from "../database/models";
import { checkJwt } from "../store/middleware";
import { validateProfileCreation, validateProfileUpdate } from "../store/validators"

const ProfileController = express.Router();

ProfileController.get('/' , checkJwt, async (req, res) => {
    const profile = await Profile.find({});

    if (profile)
        res.status(200).json(profile);
    else
        res.status(500).json({message: "No profiles found"});
});


ProfileController.get('/:userId', checkJwt, async (req, res) => {
    const profile = await Profile.find({userId: req.params.userId});

    if (profile)
        res.status(200).json(profile);
    else
        res.status(500).json({message: "No profile found for this user"});
});

ProfileController.post('/', checkJwt, async (req, res) => {
    const { error } = validateProfileCreation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    const exist = await Profile.find({userId: req.body.userId});

    if (exist.length > 0)
        return res.status(400).json({message: "This user already has a profile"})

    const profile = _.pick(req.body, ['userId','name','surname','age','skills']);

    await Profile.create(profile);
    res.status(201).send(profile);
});

ProfileController.put('/:userId', checkJwt, async (req, res) => {
    const { error } = validateProfileUpdate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    Profile.findOneAndUpdate({userId: req.params.userId}, req.body, (err) => {
        if (err)
            return res.status(403).json({error: 'Update couldn\'t be proceed'})
        return res.status(200).json({success: 'Updated!'})
    })
});

ProfileController.delete('/:userId', checkJwt, async (req, res) => {
    Profile.deleteOne({userId: req.params.userId})
        .then(()=> {
            res.status(200).json({ message: 'Profile deleted !' });
        })
        .catch( (error) => {
            res.status(400).json({ error: error });
        });
});

export default ProfileController;
