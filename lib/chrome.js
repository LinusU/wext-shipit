const execa = require('execa')

const UserError = require('./user-error')

const webstoreBinPath = require.resolve('.bin/webstore')

module.exports = async function (source) {
  let errors = []

  if (!process.env.WEXT_SHIPIT_CHROME_EXTENSION_ID) errors.push(`WEXT_SHIPIT_CHROME_EXTENSION_ID`)
  if (!process.env.WEXT_SHIPIT_CHROME_CLIENT_ID) errors.push(`WEXT_SHIPIT_CHROME_CLIENT_ID`)
  if (!process.env.WEXT_SHIPIT_CHROME_CLIENT_SECRET) errors.push(`WEXT_SHIPIT_CHROME_CLIENT_SECRET`)
  if (!process.env.WEXT_SHIPIT_CHROME_REFRESH_TOKEN) errors.push(`WEXT_SHIPIT_CHROME_REFRESH_TOKEN`)

  if (errors.length) {
    throw new UserError(`Missing ${errors.join(', ')} from environemnt`)
  }

  const args = [
    'upload',
    '--source', source,
    '--extension-id', process.env.WEXT_SHIPIT_CHROME_EXTENSION_ID,
    '--client-id', process.env.WEXT_SHIPIT_CHROME_CLIENT_ID,
    '--client-secret', process.env.WEXT_SHIPIT_CHROME_CLIENT_SECRET,
    '--refresh-token', process.env.WEXT_SHIPIT_CHROME_REFRESH_TOKEN,
    '--auto-publish'
  ]

  await execa(webstoreBinPath, args, { stdio: 'inherit' })
}
