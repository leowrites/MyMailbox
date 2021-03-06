if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const ejsMate = require('ejs-mate')
const indexRouter = require('./routes/index')
const path = require('path');
const session = require('express-session')
const cors = require('cors')
const ExpressError = require('./utils/error')
const MongoStore = require('connect-mongo')
const helmet = require('helmet');
const mongoose = require('mongoose')
const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/mailbox'
const PORT = process.env.PORT || 8000


// TODO
// Fix mongo connection

// const options = {
//   mongoUrl: dbUrl,
//   secret: process.env.SESSION_SECRET,
//   touchAfter: 24 * 60 * 6
// }

const sessionConfig = {
  name: 'session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // store: MongoStore.create(options),
  cookie: {
    secure: true,
    httpOnly: true,
  }
}

app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(helmet.contentSecurityPolicy({
  directives: {
    "form-action": ["'self'", "*.google.com"]
  }
}
))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(hpp())
app.use(cors())
app.set('trust proxy', 1)
app.use(session(sessionConfig))

app.set('views', path.resolve() + '/views')
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '/client/build')))
app.use('/api/mail', indexRouter)
app.locals.gmail = ''


// catch 404 and forward to error handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
})
app.use(function (req, res, next) {
  next(new ExpressError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err)
  res.render('error');
});

// https.createServer(app)
//   .listen(8000, () => {
//     console.log('Serving at 8000')
//   })

app.listen(PORT, () => {
  console.log('Server serving on 8000')
})
