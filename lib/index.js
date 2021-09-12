const { lintFiles, fixFiles, normalize } = require( './lint' )
const render = require( './render' )

module.exports = async function ( files, { lint = lintFiles, fix = fixFiles } = {} ) {
  render( {
    async lint() {
      return normalize( await lint( files ) )
    },
    async fix() {
      return normalize( await fix( files ) )
    },
  } )
}
