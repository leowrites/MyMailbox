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

router.get('/redirect', async (req, res) => {
    if (req.query.code) {
        const { tokens } = await oauth2Client.getToken(req.query.code)
        req.session.token = tokens
        oauth2Client.setCredentials(tokens)
        req.session.access_token = tokens
        res.redirect('http://localhost:3000/appage')
    }
})

router.get('/labels', async (req, res) => {
    const result = await gmail.users.labels.list({
        userId: 'me'
    })
    // do some processing and send back all labels for now

    const ids = result.data.labels.map(d => (
        {
            id: d.id,
            name: d.name
        }))
    res.json(ids)
})

router.post('/messages', async (req, res, next) => {
    console.log(`Fetching from ${req.body.nextPageToken}`)
    let reqConfig = {
        userId: 'me',
        maxResults: 5,
        labelIds: 'CATEGORY_PROMOTIONS'
    }

    reqConfig = req.body.nextPageToken ?
        { ...reqConfig, pageToken: req.body.nextPageToken } :
        reqConfig

    reqConfig = req.body.label ?
        { ...reqConfig, labelIds: req.body.label } :
        reqConfig

    const response = await gmail.users.messages.list(reqConfig)
    // push all fetch requests into promises
    const fetchManyMessageFromGmail = (messagesId) => {
        const promises = []
        for (let id of messagesId) {
            promises.push(gmail.users.messages.get({
                userId: 'me',
                id: id,
            }))
        }
        return Promise.all(promises)
    }

    // fetch all messages based on id returend
    const findSender = (headers) => {
        for (h of headers) {
            if (h.name === 'From') {
                return h.value
            }
        }
    }

    // process the returned messages from gmail
    const processResponse = (responses) => {
        const data = []
        responses.map(r => {
            const sender = findSender(r.data.payload.headers)
            data.push({
                id: r.data.id,
                sender: sender ? sender : 'Could not find sender',
                snippet: r.data.snippet
            })
        })
        return data
    }
    // after every fetch, we need to send the new nextPageToken back
    if (response.data.messages) {
        messagesId = response.data.messages.map(m => m.id)
        const nextPageToken = response.data.nextPageToken
        fetchManyMessageFromGmail(messagesId)
            .then(responses => processResponse(responses))
            .then(data => {
                const result = {
                    data: [...data],
                    nextPageToken: nextPageToken
                }
                res.json(result)
            }
            )
    } else {
        res.json({
            data: null,
            nextPageToken: null
        })
    }
})

router.post('/delete', async (req, res) => {
    // first need to check if logged in
    const deleteIds = req.body
    try {
        await gmail.users.messages.batchDelete({
            userId: 'me',
            requestBody: {
                ids: deleteIds
            }
        })
        res.send('success')
    } catch (err) {
        console.log(err)
    }
    // we can batch delete the requested emails
})

router.get('/auth', async (req, res, next) => {
    const userData = await gmail.users.getProfile({
        userId: 'me'
    })
    res.json(userData.data)
})

router.get('/test', async (req, res, next) => {
    //route for testing
    // get one message and look at the label Id of that message
    if (oauth2Client.getAccessToken() === null) {
        oauth2Client.setCredentials(req.session.access_token)
    }
    const testData = await gmail.users.messages.list({
        userId: 'me',
    })
    console.log(testData.data)
})

// Redirect user to google authentication
router.post('/login', (req, res, next) => {
    res.redirect(url)
})

router.post('/logout', async (req, res, next) => {
    if (req.session.access_token.access_tokens) oauth2Client.revokeToken(req.session.access_token.access_tokens)
    res.redirect('http://localhost:3000/')
})

module.exports = router;
