import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../database/models/userModel";
import {config} from "./config";
import cote from "cote";

let communicationkey;
if (dotenv.config().parsed.NODE_ENV === 'production')
    communicationkey = config.prod.communicationKEY;
else
    communicationkey = config.dev.communicationKEY;

const responder = new cote.Responder({
    name: 'userService',
    key: communicationkey,
});

export async function ParamsUserCheck(req, res, next) {
    req.middleware_values = req.params;
    req.middleware_values._id = req.params.id;
    next();
}

export async function AdminOrOwnUser(req, res, next) {
    const usertoken = req.headers.authorization;

    if (usertoken) {
        const token = usertoken.split(' ');
        try {
            const decoded = jwt.verify(token[1], config.dev.publicKEY);
            let user = await User.findOne({_id: decoded._id});

            if (user && (user.role === "admin" || user.id === String(req.middleware_values._id))) {
                next();
            } else {
                return res.status(403).json({error: 'You are not allowed to perform this action '});
            }
        } catch (error) {
            return res.status(403).json({error: 'You are not allowed to perform this action'});
        }
    }
}

export async function checkJwt(req, res, next) {
    if (!req.headers.authorization)
        return res.status(401).json({error: 'You need to be logged in to proceed'});
    else {
        const token = String(req.headers.authorization).substring(7);
        req.token = token;
        jwt.verify(token, config.dev.publicKEY, (err) => {
            if (err) {
                return res.status(403).json({error: err});
            } else
                next();
        });
    }
}
