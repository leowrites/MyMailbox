const express = require('express');
const router = express.Router();
const path = require('path');
const { google } = require('googleapis')
require('dotenv').config({
    path: path.join(path.resolve(), '.env')
})

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
    console.log(req.query.code)
    if (req.query.code) {
        const { tokens } = await oauth2Client.getToken(req.query.code)
        oauth2Client.setCredentials(tokens)
        // session isn't saving data upon refreshing
        // req.session.userProfile = userData.data
        // req.session.userMessages = messages.data
        res.redirect('http://localhost:3000/appage')
    }
});

router.get('/messages', async(req, res, next) => {
    const response = await gmail.users.messages.list({
        userId: 'me'
    })
    // fetch all messages based on id returend
    messagesId = response.data.messages.map(m => m.id)
    // push all fetch requests into promises
    const fetchManyMessageFromGmail = (messagesId) => {
        const promises = []
        for (let id of messagesId){
            promises.push(gmail.users.messages.get({
                userId: 'me',
                id: id,
            }))
        }
        return Promise.all(promises)
    }
    const processResponse = (responses) => {
        const data = []
        responses.map(r => {
            data.push({
                id: r.data.id,
                sender: r.data.payload.headers[14].value,
                snippet: r.data.snippet
            })
        })
        return data
    }
    fetchManyMessageFromGmail(messagesId)
        .then(responses => processResponse(responses))
        .then(data => res.json(data))
})

// Get user authentication information
router.get('/auth', async(req, res, next) => {
    const userData = await gmail.users.getProfile({
        userId: 'me'
    })
    res.json(userData.data)
})

// Redirect user to google authentication
router.post('/login', (req, res, next) => {
    res.redirect(url)
})

module.exports = router;
