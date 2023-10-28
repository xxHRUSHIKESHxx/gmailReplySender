// copy od its original fiel is stored in auth.txt
import express from "express";
import { google } from "googleapis";
import open from "open";
import Auths from "./auth.js";
import sendEmails from "./sendEmails.js";
const { OAuth2 } = google.auth;

const app = express();
const port = 8000;

const CLIENT_ID =
  "980793027810-a3e4bngnbqfdfahpq2o50kt83hvcb4u7.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:8000/oauth2callback";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com/"
];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

app.get("/", (req, res) => {
  Auths();
});


app.get("/oauth2callback", async (req, res) => {




  const code = req.query.code;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

// -------------------creating a lable ----------------------------
// const label = {
//   name: 'GmailReplySender', 
// };

// gmail.users.labels.create({
//   userId: 'me',
//   resource: label,
// }, (err, res) => {
//   if (err) {
//     console.error('Error creating label:', err);
//     return;
//   }
//   console.log('Label created:', res.data);
// });

// ------------getting email adress by messsages id ------------------------------
  async function getEmailAddresses(messageId) {
    try {
      const messageResponse = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full', // Use 'full' to ensure payload is available
      });
  
      if (messageResponse.data && messageResponse.data.payload) {
        const headers = messageResponse.data.payload.headers;
        const sender = headers.find((header) => header.name === 'From');
  
        if (sender) {
          console.log('Sender:', sender.value); // This will be the sender's email address
          sendEmails(sender.value)
          .then(() => {
            console.log("All emails sent successfully.");
          })
          .catch((error) => {
            console.error("Error sending emails:", error);
          });
        } else {
          console.log('Sender not found in email:', messageId);
        }
      } else {
        console.log('Payload not found in email:', messageId);
      }
    } catch (error) {
      console.error('Error fetching email addresses:', error);
    }
  }

  // setting interval for the code to rerun




  // -------------------getting message id using gamil api -----------------------------

 const MailDetails = await gmail.users.messages.list(
    {
      userId: "me",
      q: "is:unread", // Modify the query as needed
      maxResults: 5,
    },
    (err, res) => {
      if (err) {
        console.error("The API returned an error:", err);
        return;
      }

      const messages = res.data.messages;
      // const emailAddress = res.data.emailAddress;

      if (messages.length === 0) {
        console.log("No new emails found.");
      } else {
        // console.log(
        //   "New email IDs:",
        //   messages.map((message) => message.id)
        // );
        messages.map((messageId) => getEmailAddresses(messageId.id))


      }
    }
  );



  res.send("Check your console for emails.");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  open(oAuth2Client.generateAuthUrl({ access_type: "offline" }));
});
