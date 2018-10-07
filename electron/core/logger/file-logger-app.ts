import * as fs from 'fs';

var Logger = function() {

  var file = null;

  var LOGS_PATH = process.env.APPDATA + '/lindo/logs/';

  var openFile = function() {
    fs.open(LOGS_PATH + (new Date()).toISOString().substr(0,10) + ".log", "a", function(err, fd) {
      file = fd;
    });
  };

  fs.readdir(LOGS_PATH, function(err, files) {
    var today = new Date().getTime();
    files.forEach(function(file) {
      var fileDate = new Date(file.split('.')[0]).getTime();
      if (today - fileDate > 1296000000) { // 15 days
        fs.unlink(LOGS_PATH + file, function() {});
      }
    });
  });

  fs.access(LOGS_PATH, function(err) {
    if (err) fs.mkdir(LOGS_PATH, openFile);
    openFile();
  });

  this.writeLindoLog = function(msg) {
    if (file && msg && typeof msg != "function") {
      fs.write(file, "[" + (new Date()).toISOString().substr(11, 12) + "] " + JSON.stringify(msg).substr(0, 1200) + "\n", function(){});
    }
  }

};

export const logger = new Logger();
