import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";
import CryptoJS from "crypto-js";

import { User } from "../../database/models";
import { validateLogin } from "../../store/validators";
import { config } from "../../store/config";

const LoginController = express.Router();

LoginController.post('/', async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(401).json( { error: 'Incorrect email or password.' });
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(401).json( { error: 'Incorrect email or password.' });
    }
    user['token'] = jwt.sign({ _id: user._id }, config.dev.privateKEY, {expiresIn: 60*60*2, algorithm: 'RS256'});

    res.status(200).send(_.pick(user, ['_id', 'email', 'token']));
});

export default LoginController;