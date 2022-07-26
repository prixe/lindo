/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const crypto = require('crypto')
const axios = require('axios')

exports.default = async function (context) {
  const version = context.packager.appInfo.version
  const platform = context.packager.platform.name

  let resourcesPath
  if (platform === 'mac') {
    resourcesPath = '/Lindo.app/Contents/Resources/app.asar'
  } else {
    resourcesPath = '/resources/app.asar'
  }
  const path = context.appOutDir + resourcesPath
  const fileBuffer = fs.readFileSync(path)
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex')

  await axios
    .post(
      'https://lindo-app.com/api/stats/save.php',
      {
        hash,
        version,
        platform
      },
      {
        headers: {
          'X-save-secret': process.env.LINDO_KEY ?? ''
        }
      }
    )
    .catch((e) => {
      console.log(e.toString())
    })
}
