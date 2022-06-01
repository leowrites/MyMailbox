const { google } = require('googleapis')
const path = require('path')
const HOME_URL = process.env.NODE_ENV === 'production'
    ? 'https://awesome-mail-box.herokuapp.com/'
    : 'http://localhost:3000/'

const REDIRECT_URL = process.env.NODE_ENV === 'production'
    ? 'https://awesome-mail-box.herokuapp.com/'
    : 'http://localhost:8000/'
require('dotenv').config({
    path: path.join(path.resolve(), '.env')
})

const oauth = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    `${REDIRECT_URL}api/mail/login`
)

const gmail = google.gmail({
    version: 'v1',
    auth: oauth
})

module.exports.isLoggedIn = (req, res, next) => {
    req.app.locals.gmail = gmail
    // console.log(req.session.access_tokens)
    if (req.session.access_tokens) {
        console.log('Logged IN')
        oauth.setCredentials(req.session.access_tokens)
        next()
    } else {
        res.redirect(HOME_URL)
    }
}

module.exports.isAuthorized = (req, res, next) => {
    req.session.returnTo = req.originalUrl
    if (req.session.access_tokens) {
        if (req.session.access_tokens.expiry_date < Date.now()) {
            // access token has expired, get a new one
            req.session.access_tokens = null
            res.redirect(HOME_URL)
        }
        // redirect somewhere so that it can access the app
        oauth.setCredentials(req.session.access_tokens)
        req.app.locals.gmail = gmail
        res.redirect(HOME_URL + 'appage')
    } else {
        next()
    }
}

module.exports.getNewToken = (req, res) => {
    // middleware will redirect to the login page
    const url = oauth.generateAuthUrl({
        access_type: 'offline',
        scope: process.env.SCOPE
    })
    res.redirect(url)
}

module.exports.setNewToken = async (req, res, next) => {
    // once redirected back from authorization, retreive the
    // tokens and set them into session
    if (req.query.code) {
        const { tokens } = await oauth.getToken(req.query.code)
        oauth.setCredentials(tokens)
        req.session.access_tokens = tokens
    }
    next()
}

module.exports.revokeToken = async (req, res) => {
    if (req.session.access_tokens) {
        // console.log(req.session.access_tokens.access_token)
        // await oauth.revokeToken(req.session.access_tokens.access_token)
        req.session.access_tokens = null
    }
    res.redirect(HOME_URL)
} 