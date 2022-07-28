import express from "express";
import _ from "lodash";
import axios from "axios";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import {config} from "../store/config";
import { User } from "../database/models";
import { validateGitLab } from "../store/validators";
import {
    checkJwt,
} from "../store/middleware";

const GitlabController = express.Router();

let clientID;
let clientSecret;
let redirectUri;
if (dotenv.config().parsed.NODE_ENV === 'production') {
    clientID = config.prod.clientID;
    clientSecret = config.prod.clientSecret;
    redirectUri = config.prod.redirectUri;
} else {
    clientID = config.prod.clientID;
    clientSecret = config.prod.clientSecret;
    redirectUri = config.prod.redirectUri;
}

GitlabController.post('/', checkJwt, async (req, res) => {
    const { error } = validateGitLab(req.body);

    if (error) {
        return res.status(403).json({ error: error.details[0].message});
    }

    const code = req.body.code;
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], config.dev.publicKEY);
    let user = await User.findOne({_id: decoded._id});

    if (!user)
        return res.status(401).json({error: 'You need to be logged in to proceed'});
    axios({
        method: 'post',
        url: `https://gitlab.com/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectUri}`,
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {
        let access_token = response.data.access_token;
        let refresh_token = response.data.refresh_token;
        
        User.findByIdAndUpdate(user._id, {access_token, refresh_token}, (err, user) => {
            if (err)
                return res.status(403).json({error: 'Update couldn\'t be proceed'})
            return res.status(200).json({success: 'Successfully connected to GitLab'})
        })
    }).catch((err) => {
        return res.json({error: err});
    })
});

GitlabController.get('/me', checkJwt, async (req, res) => {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], config.dev.publicKEY);
    let user = await User.findOne({_id: decoded._id});

    if (!user)
        return res.status(401).json({error: 'You need to be logged in to proceed'});
    axios({
        method: 'get',
        url: `https://gitlab.com/api/v4/user`,
        headers: {
            authorization: 'Bearer ' + user.access_token,
            accept: 'application/json'
        }
    }).then((response) => {
        const gitlabId = response.data.id

        User.findByIdAndUpdate(user._id, {gitlabId}, (err, user) => {
            if (err)
                return res.status(403).json({error: 'Update couldn\'t be proceed'})
            return res.status(200).json(response.data)
        })
    }).catch((err) => {
        return res.json({error: "You need to refresh your gitlab access token"});
    })
});

GitlabController.get('/project/:id', checkJwt, async (req, res) => {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], config.dev.publicKEY);
    let user = await User.findOne({_id: decoded._id});

    if (!user)
        return res.status(401).json({error: 'You need to be logged in to proceed'});
    axios({
        method: 'get',
        url: `https://gitlab.com/api/v4/projects/` + req.params.id,
        headers: {
            authorization: 'Bearer ' + user.access_token,
            accept: 'application/json'
        }
    }).then((response) => {
        return res.status(200).json(response.data);
    }).catch((err) => {
        return res.json({error: "You need to refresh your access token"});
    })
});

GitlabController.get('/projects', checkJwt, async (req, res) => {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], config.dev.publicKEY);
    let user = await User.findOne({_id: decoded._id});

    if (!user && !user.gitlabId)
        return res.status(401).json({error: 'You need to be logged and have your gitlabId linked to proceed'});
    axios({
        method: 'get',
        url: `https://gitlab.com/api/v4/users/` + user.gitlabId + `/projects`,
        headers: {
            authorization: 'Bearer ' + user.access_token,
            accept: 'application/json'
        }
    }).then((response) => {
        return res.status(200).json(response.data);
    }).catch((err) => {
        return res.json({error: "You need to refresh your access token"});
    })
});

export default GitlabController;