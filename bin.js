#!/usr/bin/env node

require('dotenv').config()

const neodoc = require('neodoc')

const chrome = require('./lib/chrome')
const firefox = require('./lib/firefox')
const opera = require('./lib/opera')
const UserError = require('./lib/user-error')

const usage = `
Usage:
  shipit chrome <source>
  shipit firefox <source>
  shipit opera <source>
`

async function main () {
  const args = neodoc.run(usage)

  if (args.chrome) {
    await chrome(args['<source>'])
  }

  if (args.firefox) {
    await firefox(args['<source>'])
  }

  if (args.opera) {
    await opera(args['<source>'])
  }
}

main().catch((err) => {
  process.exitCode = 1
  console.error((err instanceof UserError) ? err.message : err.stack)
})
