import * as fs from 'fs';
import { app } from 'electron';
import { Logger } from '../logger/logger-electron';

var FileLogger = function() {

  var file = null;

  var LOGS_PATH = app.getPath('userData') + '/logs/';

  var openFile = function() {
    fs.open(LOGS_PATH + (new Date()).toISOString().substr(0,10) + ".log", "a", function(err, fd) {
      if (!err) file = fd;
    });
  };

  // Delete old files
  fs.readdir(LOGS_PATH, function(err, files) {
    if (err) Logger.info(err.toString());
    else {
      var today = new Date().getTime();
      files.forEach(function(file) {
        var fileDate = new Date(file.split('.')[0]).getTime();
        if (today - fileDate > 1296000000) { // 15 days
          fs.unlink(LOGS_PATH + file, function() {});
        }
      });
    }
  });

  fs.access(LOGS_PATH, function(err) {
    if (err) fs.mkdir(LOGS_PATH, openFile);
    else openFile();
  });

  this.writeLindoLog = function(msg) {
    if (file && msg && typeof msg != "function") {
      fs.write(file, "[" + (new Date()).toISOString().substr(11, 12) + "] " + JSON.stringify(msg).substr(0, 1200) + "\n", function(){});
    }
  }

};

export const logger = new FileLogger();
