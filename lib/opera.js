const execa = require('execa')
const path = require('path')
const ora = require('ora')
const temp = require('fs-temp/promise')
const globby = require('globby')
const uploadOperaExtension = require('upload-opera-extension')

const UserError = require('./user-error')

const webextBinPath = require.resolve('.bin/web-ext')

module.exports = async function (source) {
  let errors = []

  if (!process.env.WEXT_SHIPIT_OPERA_EMAIL) errors.push(`WEXT_SHIPIT_OPERA_EMAIL`)
  if (!process.env.WEXT_SHIPIT_OPERA_EXTENSION_ID) errors.push(`WEXT_SHIPIT_OPERA_EXTENSION_ID`)
  if (!process.env.WEXT_SHIPIT_OPERA_PASSWORD) errors.push(`WEXT_SHIPIT_OPERA_PASSWORD`)

  if (errors.length) {
    throw new UserError(`Missing ${errors.join(', ')} from environemnt`)
  }

  const artifacts = await temp.mkdir()

  const args = [
    'build',
    '--source-dir', source,
    '--artifacts-dir', artifacts,
    '--ignore-files', '.api-key package.json package-lock.json yarn.lock .npmrc .yarnc'
  ]

  const spinner = ora()

  try {
    spinner.start('Packing extension...')
    await execa(webextBinPath, args, { stdio: ['ignore', 'pipe', 'inherit'] })
    const files = await globby('*.zip', { cwd: artifacts })

    if (files.length !== 1) {
      throw new Error('Failed to locate build artifcat')
    }

    spinner.text = 'Uploading extension...'
    await uploadOperaExtension({
      email: process.env.WEXT_SHIPIT_OPERA_EMAIL,
      extensionId: process.env.WEXT_SHIPIT_OPERA_EXTENSION_ID,
      password: process.env.WEXT_SHIPIT_OPERA_PASSWORD,
      zipPath: path.join(artifacts, files[0])
    })

    spinner.succeed('Extension submitted for modernation 🙌')
  } catch (err) {
    spinner.fail(String(err))
    throw err
  }
}
