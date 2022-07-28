import dotenv from "dotenv";
import fs from "fs";

export const config = {
  dev: {
    port: 8080,
    mongoDBUri: 'mongodb://localhost/userService',
    mongoHostName: 'localhost',
    privateKEY: fs.readFileSync('./store/private.key'),
    publicKEY: fs.readFileSync('./store/public.key'),
    communicationKEY: dotenv.config().parsed.COMMUNICATION_KEY,
    clientID: dotenv.config().parsed.CLIENT_ID,
    clientSecret: dotenv.config().parsed.CLIENT_SECRET,
    redirectUri: dotenv.config().parsed.REDIRECT_URI
  },
  prod: {
    port: 8080,
    mongoDBUri: 'mongodb://localhost/userService',
    mongoHostName: 'localhost',
    privateKEY: fs.readFileSync('./store/private.key'),
    publicKEY: fs.readFileSync('./store/public.key'),
    communicationKEY: dotenv.config().parsed.COMMUNICATION_KEY,
    clientID: dotenv.config().parsed.CLIENT_ID,
    clientSecret: dotenv.config().parsed.CLIENT_SECRET,
    redirectUri: dotenv.config().parsed.REDIRECT_URI
  }
};