import express from "express";
import _ from "lodash";

import { User, Profile, Review } from "../database/models";
import jwt from "jsonwebtoken";
import { checkJwt } from "../store/middleware";
import { config } from "../store/config";
import {validateClaim} from "../store/validators";

const ClaimController = express.Router();

ClaimController.post('/' , checkJwt, async (req, res) => {
    const { error } = validateClaim(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    const decoded = jwt.verify(req.token, config.dev.publicKEY);
    
    const user = await User.findOne({_id: decoded._id});
    let profile = await Profile.findOne({userId: decoded._id});
    const review = await Review.findOne({_id: req.body.reviewId});

    let missingSkills = [];
    const skillsNeeded = review.objectives.concat(review.skillsNeeded);

    if (!profile)
        profile = {skills: []}

    skillsNeeded.forEach((skill)=>{
        if (!profile.skills.includes(skill))
            missingSkills.push(skill)
    })

    if (!user)
        return res.status(200).json({message: "User not found."});
    if (!review)
        return res.status(200).json({message: "Review not found."});

    if (user.claimUsers.includes(user._id)) {
        return res.status(200).json({
            message: "You already claimed this review."
        });
    }
    if (missingSkills.length) {
        return res.status(200).json({
            message: "Skills missing.",
            skillsNeeded: skillsNeeded,
            userSkills: profile.skills,
            missingSkills: missingSkills
        });
    }
    user.claimUsers.push(user._id);
    user.claimUsers = [...new Set(user.claimUsers)];
    await user.save();
    return res.status(200).json({
        message: `${review.name} succesfully claimed.`,
        mail: user.email,
        skillsNeeded: skillsNeeded,
        userSkills: profile.skills,
        claimUsers: user.claimUsers
    });
});

ClaimController.post('/undo' , checkJwt, async (req, res) => {
    const { error } = validateClaim(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    const decoded = jwt.verify(req.token, config.dev.publicKEY);
    
    const user = await User.findOne({_id: decoded._id});
    const profile = await Profile.findOne({userId: decoded._id});
    const review = await Review.findOne({_id: req.body.reviewId});

    if (!user)
        return res.status(200).json({message: "User not found."});
    if (!review)
        return res.status(200).json({message: "Review not found."});

    if (!user.claimUsers.includes(user._id)) {
        return res.status(200).json({
            message: "This review is not claimed by your account"
        });
    }

    var index = user.claimUsers.indexOf(user._id);
    user.claimUsers.splice(index, 1);
    await user.save();
    return res.status(200).json({
        message: `${review.name} succesfully unclaimed.`,
    });
});

export default ClaimController;
