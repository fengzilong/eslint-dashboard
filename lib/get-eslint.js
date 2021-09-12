const semver = require( 'semver' )
const importCwd = require( 'import-cwd' )
const peerDeps = require( '../package.json' ).peerDependencies
const logger = require( './logger' )

module.exports = function getESLint() {
  const localESLintPkg = importCwd.silent( 'eslint/package.json' )

  let ESLint = null

  if ( !localESLintPkg ) {
    console.log()
    logger.error( `No local eslint is found, please install it first` )
    process.exit( 0 )
  } else if ( !semver.satisfies( localESLintPkg.version, peerDeps.eslint ) ) {
    console.log()
    logger.error( `Local Installed ESLint version should satisfy ${ peerDeps.eslint }` )
    process.exit( 0 )
  } else {
    ESLint = importCwd.silent( 'eslint' ).ESLint
  }

  return ESLint
}
