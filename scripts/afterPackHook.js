/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const crypto = require('crypto')

exports.default = async function (context) {
  console.log('afterPackHook')
  console.log(context)

  const version = context.packager.appInfo.version
  const platform = context.packager.platform.name
  // console.log(process.env.LINDO_KEY)
  const path = context.appOutDir + '/Lindo.app/Contents/Resources/app.asar'
  const fileBuffer = fs.readFileSync(path)
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex')
  console.log({ hash, version, platform })
}
