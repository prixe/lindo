/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const crypto = require('crypto')

exports.default = async function (context) {
  console.log('afterPackHook')
  console.log(context)

  const version = context.packager.appInfo.version
  const platform = context.packager.platform.name
  // console.log(process.env.LINDO_KEY)
  let resourcesPath
  if (platform === 'mac') {
    resourcesPath = '/Lindo.app/Contents/Resources/app.asar'
  } else {
    resourcesPath = '/resources/app.asar'
  }
  const path = context.appOutDir + resourcesPath
  const fileBuffer = fs.readFileSync(path)
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex')
  console.log({ hash, version, platform })
}
