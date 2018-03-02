var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var programs = require('./routes/programs');
var dde = require('./routes/dde');

var bfj = require("bfj");
var bpmn = require(path.resolve("client", "src", "lib", "process_bpmn.js")).ProcessBPMN;
var chokidar = require('chokidar');

var app = express();

var watcher = chokidar.watch('./client/src/programs', {persistent: true});

async function generateTree(filename, cb) {

  var root = "";
  var folder = "";

  var parts = filename.match(/(^.+)\/([^\/]+)\.bpmn$/i);

  if (parts) {

    folder = String(parts[1]).trim();
    root = String(parts[2]).trim();

  } else {

    root = "unknown";

    return;

  }

  var raw,
    json;

  bpmn.init(filename);

  raw = bpmn.raw;

  bpmn.loadDataTypes(function () {

    bpmn
      .createTree(function () {

        fs.writeFileSync(folder + "/." + root + "-raw.json", JSON.stringify(bpmn.raw, undefined, 2));

        fs.writeFileSync(folder + "/." + root + "-intermediate.json", JSON.stringify(bpmn.json, undefined, 2));

        bfj
          .stringify(bpmn.tree)
          .then(json => {

            fs.writeFileSync(folder + "/" + root + ".json", json);

            var dictionary = {};

            bpmn
              .json
              .payload
              .forEach(function (row) {

                dictionary[row.id] = row.label;

              })

            fs.writeFileSync(folder + "/." + root + "-dictionary.json", JSON.stringify(dictionary, undefined, 2));

            cb && cb();

          })

      });

  });

}

var log = console
  .log
  .bind(console);
// Add event listeners.
watcher.on('add', filename => {

  var parts = filename.match(/(^.+)\/([^\/]+)\.bpmn$/i);

  if (!parts) 
    return;
  
  log(`File ${filename} has been added`);

  generateTree(filename, () => {

    console.log("Done!");

  })

}).on('change', filename => {

  var parts = filename.match(/(^.+)\/([^\/]+)\.bpmn$/i);

  if (!parts) 
    return;
  
  log(`File ${filename} has been changed`);

  generateTree(filename, () => {

    console.log("Done!");

  })

}).on('unlink', filename => {

  var parts = filename.match(/(^.+)\/([^\/]+)\.bpmn$/i);

  if (!parts) 
    return;
  
  log(`File ${filename} has been removed`);

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/programs', programs);
app.use('/dde', dde);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req
    .app
    .get('env') === 'development'
    ? err
    : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;