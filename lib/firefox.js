const execa = require('execa')
const ora = require('ora')
const StreamSearch = require('text-stream-search')

const UserError = require('./user-error')

const webextBinPath = require.resolve('.bin/web-ext')

module.exports = async function (source) {
  let errors = []

  if (!process.env.WEXT_SHIPIT_FIREFOX_JWT_ISSUER) errors.push(`WEXT_SHIPIT_FIREFOX_JWT_ISSUER`)
  if (!process.env.WEXT_SHIPIT_FIREFOX_JWT_SECRET) errors.push(`WEXT_SHIPIT_FIREFOX_JWT_SECRET`)

  if (errors.length) {
    throw new UserError(`Missing ${errors.join(', ')} from environemnt`)
  }

  const args = [
    'sign',
    '--source-dir', source,
    '--api-key', process.env.WEXT_SHIPIT_FIREFOX_JWT_ISSUER,
    '--api-secret', process.env.WEXT_SHIPIT_FIREFOX_JWT_SECRET
  ]

  const spinner = ora('Loading web-ext tool...').start()

  try {
    const child = execa(webextBinPath, args, { stdio: ['ignore', 'pipe', 'inherit'] })
    const searcher = new StreamSearch(child.stdout)

    let wasSubmitted = false

    searcher.waitForText('Building web extension')
      .then(() => { spinner.text = 'Building extension...' })

    searcher.waitForText('Validating add-on')
      .then(() => { spinner.text = 'Validating extension...' })

    searcher.waitForText('Validation results:')
      .then(() => { spinner.text = 'Submitting extension...' })

    searcher.waitForText('Your add-on has been submitted for review.')
      .then(() => { wasSubmitted = true })

    try {
      await child
    } catch (err) {
      if (err.code !== 1 || !wasSubmitted) throw err
    }

    if (!wasSubmitted) {
      throw new Error('Failed to submit extension to addons.mozilla.org')
    }

    spinner.succeed('Extension submitted 🎉')
  } catch (err) {
    spinner.fail(String(err))
    throw err
  }
}
