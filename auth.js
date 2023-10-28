// originally this is a copy of app .js

import express from "express";
import { google } from "googleapis";
import open from "open";
import readline from "readline";

const { OAuth2 } = google.auth;

const app = express();
const port = 8000;

// Replace with your OAuth 2.0 credentials
const CLIENT_ID =
  "980793027810-a3e4bngnbqfdfahpq2o50kt83hvcb4u7.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:8000/oauth2callback";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com/",
];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const Auths = () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  // console.log('Authorize this app by visiting this URL:', authUrl);
  open(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
};

export default Auths();
