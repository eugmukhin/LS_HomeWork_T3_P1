const express = require('express');
const session = require('express-session');
const path = require('path');
const errorHandler = require('./libs/error');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'keyboard cat',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null
    },
    saveUninitialized: false,
    resave: false
  })
);

app.use(flash());

app.use('/', require('./routes/'));

app.use(function (req, res, next) {
  const err = new Error('Страница не найдена');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port ' + server.address().port);
});
