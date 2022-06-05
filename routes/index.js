const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const mailController = require('../controllers/mail')
const { isAuthorized, isLoggedIn, getNewToken,
    setNewToken, revokeToken } = require('../middleware')

router.get('/redirect', isLoggedIn, catchAsync(mailController.redirect))

router.get('/labels', isLoggedIn, catchAsync(mailController.getLabels))

router.post('/messages', isLoggedIn, catchAsync(mailController.getMessages))

router.post('/delete', isLoggedIn, catchAsync(mailController.deleteMessagse))

router.get('/auth', isLoggedIn, catchAsync(mailController.auth))

router.get('/test', catchAsync(mailController.test))

// Redirect user to google authentication
router.post('/login', isAuthorized, getNewToken, mailController.loginPost)

router.get('/login', setNewToken, mailController.loginGet)

router.post('/logout', revokeToken, mailController.logout)

router.post('/send', isLoggedIn, catchAsync(mailController.send))

module.exports = router;
