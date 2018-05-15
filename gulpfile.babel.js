import gulp from 'gulp';
import async from 'async';
import prettify from 'gulp-jsbeautifier';
import replace from 'gulp-replace';
import request from 'request';
import fs from 'fs-extra';

//Le jeu
gulp.task('update:game:script', updateGameScript);
gulp.task('update:game:assets', updateGameAssets);
gulp.task('update:game', gulp.series(updateGameScript, updateGameAssets));

// Beta URL: https://earlyproxy.touch.dofus.com/

// DON'T EDIT THESE REGEX
// Since the auto update feature, regex to patch the script.js are stored in the repo:
// https://github.com/Clover-Lindo/lindo-game-base
export function updateGameScript(cb) {

    async.waterfall([
        function (callback) {
            downloadBinary('https://proxyconnection.touch.dofus.com/build/script.js', './game/build/script.js', function () {
                gulp.src(['./game/build/script.js'])
                    .pipe(prettify({
                        "break_chained_methods": true,
                    }))
                    .pipe(replace("cdvfile://localhost/persistent/data/assets", "assets"))
                    .pipe(replace("window.Config.analytics", "null"))
                    .pipe(replace(/(overrideConsole.=.function\(\) {)([^])*(},._.logUncaughtExceptions)/g, '$1$3'))
                    .pipe(replace(/(logUncaughtExceptions.=.function\(.*\).{)([^])*(},.*\.exports.*=.*_\n},.*function\(e,.*t,.*i\))/g, '$1$3'))
                    .pipe(replace(/this.send\(.*, d\("login"\)\)/g, 'var _scm_ = d("login"); for (var i in window._){ _scm_[i] = window._[i]}; this.send("connecting", _scm_);'))
                    .pipe(replace(/(this\.send\(.*,.d\({\n.*\n.*\n.*\n.*\n.*)(}\),.*\("serverDisconnecting")/g, 'var _scm_ = d({address: a,port: r,id: e}); for (var i in window._) {_scm_[i] = window._[i]};this.send("connecting", _scm_);$2'))
                    .pipe(replace(/window\.buildVersion.*=.*"\d*\.\d*\.\d*",/g, ""))
                    // .pipe(replace(/(var.*=.*\.touches\s\|\|.*\[\],)/g, 'if (e.type === "mousedown" || e.type === "mouseup") {return o.x = e.clientX, o.y = e.clientY, { x: o.x, y: o.y, touchCount: "mouseup" === e.type ? 0 : 1, touches: [{x: o.x, y: o.y }] } }\n$1'))
                    // .pipe(replace(/(\"ontouchstart\" in window)/g, "false && $1"))
                    .pipe(replace(/(var\s*[a-z]*\s*=\s*this,\n*\s*[a-z]*\s=\s*window\.dofus\.connectionManager;\n\s*i.on\("ServersListMessage",)/g, "window.d = this; \n $1"))
                    .pipe(replace(/([a-z]\([a-z],\s*[a-z]\),\s*[a-z]\.exports\s*=\s*n,\s*n\.prototype\._addFightModeToolTip\s*=\s*function\([a-z],\s*[a-z],\s*[a-z]\)\s*{)/g, "window.CharacterDisplay = c;\n\t$1"))
                    .pipe(replace(/(, window\.fetch\(.+\/logger)/g, "; top.console.log(n); return null $1"))
                    .pipe(gulp.dest('./game'))
                    .on('end', callback);
            });

        },
        function (callback) {
            downloadBinary('https://proxyconnection.touch.dofus.com/build/styles-native.css', './game/build/styles-native.css', function () {
                gulp.src(['./game/build/styles-native.css'])
                    .pipe(prettify())
                    .pipe(replace("cdvfile://localhost/persistent/data/assets", "assets"))
                    .pipe(gulp.dest('./game'))
                    .on('end', callback);
            });
        },

    ], function (err, result) {
        cb();
    });
}

export function updateGameAssets(cb) {

    request.get({
        url: 'https://proxyconnection.touch.dofus.com/assetMap.json',
        forever: true
    }, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            let bodyParse = JSON.parse(body);

            //console.log(bodyParse.files);

            async.eachSeries(bodyParse.files, function (file, callback) {
                downloadBinary('https://proxyconnection.touch.dofus.com/' + file.filename, './game/' + file.filename, callback)
            }, function (err) {

                if (err) {
                    console.log('A file failed to process');
                    cb();
                } else {
                    console.log('All files have been processed successfully');
                    cb();
                }
            });


        } else {
            console.error(error);
            cb(error);
        }
    });
}


function downloadBinary(uri, savePath, callback) {
    console.log(uri);
    fs.ensureFile(savePath, function (err) {
        request.head(uri, function (error, response, body) {
            request(uri).pipe(fs.createWriteStream(savePath))
                .on('close', () => {
                    console.log(savePath);
                    callback();
                }).on('error', (error) => {
                console.log(error);
            });

            if (error) {
                console.log(error);
            }
        });
    });
}

function downloadBinaryPrettify(uri, savePath, callback) {
    fs.ensureFile(savePath, function (err) {
        request.head(uri, function (error, response, body) {
            request(uri)
                .pipe(fs.createWriteStream(savePath)).on('close', callback);
        });
    });
}
