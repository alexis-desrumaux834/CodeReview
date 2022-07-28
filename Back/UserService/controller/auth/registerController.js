import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";
import CryptoJS from "crypto-js";

import { User } from "../../database/models";
import { validateRegister } from "../../store/validators";
import { config } from "../../store/config";

const RegisterController = express.Router();

RegisterController.post('/', async (req, res) => {
    const {error} = validateRegister(req.body);

    if (error)
        return res.status(400).json( { error: error.details[0].message });

    let userEmail = await User.findOne({ email: req.body.email });
    let userUsername = await User.findOne({ username: req.body.username });
    if (userEmail || userUsername) {
        return res.status(401).json( { error: 'That user already exist !' });
    } else {
        let user;

        if (userEmail)
            user = userEmail;
        else
            user = userUsername;
        user = new User(_.pick(req.body, ['username', 'email', 'password']));
        user['role'] = 'user';
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user['token'] = jwt.sign({ _id: user._id }, config.dev.privateKEY, {expiresIn: 60*60*2, algorithm: 'RS256'});

        await user.save();

        res.status(201).send(_.pick(user, ['_id', 'username', 'email', 'token']));
    }
});

export default RegisterController;