const path = require('path')
const fs = require('fs')
const JsonBigint = require('json-bigint')({ strict: true })

const stringify = o => JsonBigint.stringify(o, null, 2)

const parse = s => {
  // try normal JSON parse first for its more helpful syntax errors
  JSON.parse(s)
  return JsonBigint.parse(s)
}

const read = file_path => {
  const abs_file_path = path.resolve(process.cwd(), file_path)
  const object_text = fs.readFileSync(abs_file_path)
  return parse(object_text)
}

const write = () => {
  throw new Error('not implmented')
}

module.exports = {
  stringify,
  parse,
  read,
  write
}
