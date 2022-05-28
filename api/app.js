const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const ejsMate = require('ejs-mate')
const indexRouter = require('./routes/mail/index')
const ExpressError = require('./error')
const path = require('path');
const session = require('cookie-session')
const cors = require('cors')


const sessionConfig = {
  name: 'session',
  secret: '6D7249AF5C762F9D47E91A2375F71',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}

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

app.use('/api/mail', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(new ExpressError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err)
  res.render('error');
});

app.listen(8000, () => {
  console.log('Server serving on 8000')
})
