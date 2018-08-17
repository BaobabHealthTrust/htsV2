'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var bfj = require("bfj");
var bpmn = require(path.resolve('lib', 'process_bpmn.js')).ProcessBPMN;
var chokidar = require('chokidar');

var app = module.exports = loopback();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var watcher = chokidar.watch('./programs', { persistent: true });

function generateTree(filename, cb) {

  var root = '';
  var folder = '';

  var parts = filename.match(/(^.+)\/([^\/]+)\.bpmn$/i);

  if (parts) {

    folder = String(parts[1]).trim();

    root = String(parts[2]).trim();

  } else {

    root = 'unknown';
    return;

  }

  var raw,
    json;

  bpmn.init(filename);

  raw = bpmn.raw;

  bpmn.loadDataTypes(function () {

    bpmn
      .createTree(function () {

        fs.writeFileSync(folder + '/.' + root + '-raw.json', JSON.stringify(bpmn.raw, undefined, 2));

        fs.writeFileSync(folder + '/.' + root + '-intermediate.json', JSON.stringify(bpmn.json, undefined, 2));

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

    console.log('Done!');

  })

}).on('change', filename => {

  var parts = filename.match(/(^.+)\/([^\/]+)\.bpmn$/i);

  if (!parts)
    return;

  log(`File ${filename} has been changed`);

  generateTree(filename, () => {

    console.log('Done!');

  })

}).on('unlink', filename => {

  var parts = filename.match(/(^.+)\/([^\/]+)\.bpmn$/i);

  if (!parts)
    return;

  log(`File ${filename} has been removed`);

});

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    var baseUrl = app
      .get('url')
      .replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app
        .get('loopback-component-explorer')
        .mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, { appRootDir: __dirname, masterConfigsInJavascript: true }, function (err) {
  if (err)
    throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
}
);
