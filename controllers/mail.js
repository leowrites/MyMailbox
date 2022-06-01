const HOME_URL = process.env.NODE_ENV === 'production'
    ? 'https://awesome-mail-box.herokuapp.com/'
    : 'http://localhost:3000/'

module.exports.redirect = async (req, res) => {
    // redirects them to where they were or log them into the app
    // console.log(req.session.returnTo)
    res.redirect(`${HOME_URL}appage`)
}

module.exports.getLabels = async (req, res) => {
    const result = await req.app.locals.gmail.users.labels.list({
        userId: 'me'
    })
    // do some processing and send back all labels for now

    const ids = result.data.labels.map(d => (
        {
            id: d.id,
            name: d.name
        }))
    res.json(ids)
}

module.exports.getMessages = async (req, res, next) => {
    // console.log(`Fetching from ${req.body.nextPageToken}`)
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

    const response = await req.app.locals.gmail.users.messages.list(reqConfig)
    // push all fetch requests into promises
    const fetchManyMessageFromGmail = (messagesId) => {
        const promises = []
        for (let id of messagesId) {
            promises.push(req.app.locals.gmail.users.messages.get({
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
                // console.log(result)
                res.json(result)
            }
            )
    } else {
        res.json({
            data: null,
            nextPageToken: null
        })
    }
}

module.exports.deleteMessagse = async (req, res) => {
    // first need to check if logged in
    const deleteIds = req.body
    await req.app.locals.gmail.users.messages.batchDelete({
        userId: 'me',
        requestBody: {
            ids: deleteIds
        }
    })
    res.send('success')
}

module.exports.auth = async (req, res, next) => {
    const userData = await req.app.locals.gmail.users.getProfile({
        userId: 'me'
    })
    res.json(userData.data)
}

module.exports.test = async (req, res, next) => {
    //route for testing
    // get one message and look at the label Id of that message
    if (oauth2Client.getAccessToken() === null) {
        oauth2Client.setCredentials(req.session.access_token)
    }
    const testData = await req.app.locals.gmail.users.messages.list({
        userId: 'me',
    })
    // console.log(testData.data)
}

module.exports.loginPost = (req, res, next) => {
    // won't need to do much, just call the middleware
    console.log('Redirecting to login page...')
}

module.exports.loginGet = (req, res, next) => {
    // redirect to redirect for verification
    res.redirect('redirect')
}

module.exports.logout = (req, res, next) => {
    // won't need to do much, all handled by middleware
    console.log('Good bye!')
}