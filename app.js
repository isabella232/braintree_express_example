import express from 'express';
import { join } from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan-debug';
import { json, urlencoded } from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';
import router from './routes';
import lessMiddleware from 'less-middleware';
import createError from 'http-errors';

const app = express();
const staticRoot = join(__dirname, 'public');

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(join(staticRoot, 'images', 'favicon.png')));
app.use(logger('braintree_example:app', 'dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(
  lessMiddleware('src', {
    dest: 'public',
    pathRoot: __dirname
  })
);
app.use(
  session({
    // this string is not an appropriate value for a production environment
    // read the express-session documentation for details
    secret: '---',
    saveUninitialized: true,
    resave: true
  })
);
app.use(express.static(staticRoot));
app.use(flash());

app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export default app;
