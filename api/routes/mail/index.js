const express = require('express');
const router = express.Router();
const path = require('path');
const { google } = require('googleapis')
require('dotenv').config({
    path: path.join(path.resolve(), '.env')
})

// TODO
// Need to wrap everything around try catch to validate login
// move everything to middleware and check authorization
// if there is no access_token then prompt for authorization

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

let access_tokens

router.get('/', async (req, res, next) => {
    if (req.query.code) {
        const { tokens } = await oauth2Client.getToken(req.query.code)
        req.session.token = tokens
        oauth2Client.setCredentials(tokens)
        // session isn't saving data upon refreshing
        // req.session.userProfile = userData.data
        // req.session.userMessages = messages.data
        res.redirect('http://localhost:3000/appage')
    }
});

router.get('/messages', async(req, res, next) => {
    const response = await gmail.users.messages.list(
        // req.session.pageToken ? 
        // {...reqConfig, pageToken: req.session.pageToken} :
        {
            userId: 'me',
            labelIds: 'CATEGORY_PROMOTIONS'
        }
    )
    const findSender = (headers) => {
        for (h of headers) {
            if (h.name === 'From') {
                return h.value
            }
        }
    }
    // fetch all messages based on id returend
    messagesId = response.data.messages.map(m => m.id)
    // get the next page token and store it in session
    // console.log(messagesId)
    // req.session.pageToken = response.data.nextPageToken
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
            const sender = findSender(r.data.payload.headers)
            data.push({
                id: r.data.id,
                sender: sender? sender : 'Could not find sender',
                snippet: r.data.snippet
            })
        })
        return data
    }
    fetchManyMessageFromGmail(messagesId)
        .then(responses => processResponse(responses))
        .then(data => res.json(data))
})

router.post('/delete', async(req, res) => {
    // first need to check if logged in
    const deleteIds = req.body
    try{
        await gmail.users.messages.batchDelete({
            userId: 'me',
            requestBody: {
                ids: deleteIds
            }
        })
        res.send('success')
    } catch(err) {
        console.log(err)
    }
    // we can batch delete the requested emails
})

router.get('/auth', async(req, res, next) => {
    const userData = await gmail.users.getProfile({
        userId: 'me'
    })
    res.json(userData.data)
})

router.get('/test', async(req, res, next) => {
    //route for testing
    // get one message and look at the label Id of that message
    if (oauth2Client.getAccessToken() === null){
        oauth2Client.setCredentials(req.session.access_token)
    }
    const testData = await gmail.users.messages.list({
        userId:'me',
    })    
    console.log(testData.data)
})

// Redirect user to google authentication
router.post('/login', (req, res, next) => {
    res.redirect(url)
})

router.post('/logout', async(req, res, next) => {
    if (req.session.access_token.access_tokens) oauth2Client.revokeToken(access_tokens.access_token)
    res.redirect('http://localhost:3000/')
})

module.exports = router;
