const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { env } = require('process');

exports.default = async function (context) {
  console.log('afterPackHook');
  console.log(context)

  const version = context.packager.appInfo.version;
  const platform = context.packager.platform.name;
  // console.log(process.env.LINDO_KEY)
  const path = context.appOutDir + '/Lindo.app/Contents/Resources/app.asar'
  const fileBuffer = fs.readFileSync(path);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);

  const hash = hashSum.digest('hex');
  console.log({ hash, version, platform })
}