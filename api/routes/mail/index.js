const express = require('express');
const router = express.Router();
const path = require('path');
const { google } = require('googleapis')
require('dotenv').config({
    path: path.join(__dirname, '/.env')
  })
// const cors = require('cors')
// router.use(cors)

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: process.env.SCOPE
})

const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client
})


router.get('/', async (req, res, next) => {
    let isAuthenticated = false
    if (req.query.code){
        const { tokens } = await oauth2Client.getToken(req.query.code)
        oauth2Client.setCredentials(tokens)
        isAuthenticated = true
    }
    res.send(isAuthenticated)
});

router.post('/', (req, res, next) => {
    // console.log(url)
    res.redirect(url)
})

module.exports = router;
