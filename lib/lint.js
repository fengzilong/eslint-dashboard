const path = require( 'path' )
const getESLint = require( './get-eslint' )
const mo = require( 'eslint-formatter-mo' )

const ESLint = getESLint()

const linter = new ESLint()
const fixer = new ESLint( { fix: true } )

async function lintFiles( files = [] ) {
  return await linter.lintFiles( files )
}

function format( results ) {
  return mo( results )
}

async function fixFiles( files = [] ) {
  const results = await fixer.lintFiles( files )

  await ESLint.outputFixes( results )

  return results
}

function normalize( reports = [] ) {
  return reports.map( report => {
    return {
      file: path.relative( process.cwd(), report.filePath ),
      report: format( [ report ] ).trim(),
      original: report
    }
  } ).filter( r => r.report )
}

exports.lintFiles = lintFiles
exports.fixFiles = fixFiles
exports.format = format
exports.normalize = normalize
