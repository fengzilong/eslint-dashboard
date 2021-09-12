const blessed = require( 'blessed' )
const plur = require( 'plur' )

async function render( props = {} ) {
  const { lint, fix } = props

  if ( typeof lint !== 'function' || typeof fix !== 'function' ) {
    return
  }

  let reports = await lint()

  // screen start
  const screen = blessed.screen( {
    smartCSR: true,
    fullUnicode: true,
    dockBorders: true,
    ignoreDockContrast: true,
  } )

  screen.key( [ 'escape', 'q', 'C-c' ], function () {
    return screen.destroy()
  } )
  // screen end

  // code start
  var code = blessed.box( {
    top: 0,
    right: 0,
    width: '80%',
    height: '90%',
    label: ' {bold}{cyan-fg}Report{/cyan-fg}{/bold} ',
    tags: true,
    padding: {
      left: 1,
      top: 0,
      right: 1,
      bottom: 0,
    },
    border: 'line',
    content: '',
    mouse: true,
    keys: true,
    vi: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      ch: ' ',
      track: {
        bg: 'cyan'
      },
      style: {
        inverse: true
      }
    }
  } )

  screen.append( code )
  // code end

  // files start
  let selectedFile = ''

  var files = blessed.list( {
    top: 0,
    left: 0,
    width: '20%',
    height: '90%',
    label: ' {bold}{cyan-fg}Files{/cyan-fg}{/bold} ',
    tags: true,
    keys: true,
    vi: true,
    mouse: true,
    border: 'line',
    padding: 1,
    scrollbar: {
      ch: ' ',
      track: {
        bg: 'cyan'
      },
      style: {
        inverse: true
      }
    },
    selectedBg: 'green',
    selectedFg: 'black'
  } )

  files.setItems( reports.map( report => report.file ) )

  files.on( 'select item', ( file, index ) => {
    select( index )
    screen.render()
  } )

  function select( index ) {
    const report = reports[ index ]
    code.setContent( ( report && report.report ) || '', true )
    selectedFile = report && report.file
  }

  select( 0 )

  screen.append( files )

  files.focus()
  // files end

  // toaster start
  const toaster = blessed.box( {
    left: 'center',
    top: 'center',
    height: 5,
    width: '25%',
    content: 'haha',
    align: 'center',
    valign: 'middle',
    border: {
      type: 'line',
      fg: 'grey',
    },
    padding: 1,
    fg: 'black',
    bg: 'green'
  } )
  screen.append( toaster )

  function toast( message, { color = 'green' } = {} ) {
    toaster.setContent( message, true )
    toaster.style.bg = color
    toaster.show()
    screen.render()

    setTimeout( () => {
      toaster.hide()
      screen.render()
    }, 1000 )
  }
  toaster.hide()
  // toaster end

  // action start
  var actions = blessed.layout( {
    bottom: 0,
    left: 'center',
    width: 20 * 2 + 15,
    height: '10%',
    mouse: true,
    layout: 'inline',
  } )

  screen.append( actions )

  const lintButton = blessed.button( {
    width: 20,
    height: '100%',
    align: 'center',
    content: 'Lint Again',
    mouse: true,
    border: {
      type: 'line',
      fg: 'magenta'
    },
    fg: 'magenta',
    padding: {
      left: 1,
      right: 1,
    },
  } )

  const fixButton = blessed.button( {
    width: 20,
    height: '100%',
    align: 'center',
    content: 'Auto Fix',
    mouse: true,
    border: {
      type: 'line',
      fg: 'green'
    },
    fg: 'green',
    padding: {
      left: 1,
      right: 1,
    },
  } )

  const closeButton = blessed.button( {
    width: 15,
    height: '100%',
    align: 'center',
    content: 'Close',
    mouse: true,
    border: {
      type: 'line',
      fg: 'grey'
    },
    fg: 'grey',
    padding: {
      left: 1,
      right: 1,
    },
  } )

  actions.append( lintButton )
  actions.append( fixButton )
  actions.append( closeButton )

  function refresh( reports ) {
    files.setItems( reports.map( report => report.file ) )

    const index = reports.findIndex( r => r.file === selectedFile )
    select( ( selectedFile && ~index ) ? index : 0 )

    screen.render()
  }

  lintButton.on( 'click', async () => {
    reports = await lint()
    refresh( reports )
    toast( 'Refreshed', { color: 'magenta' } )
  } )

  fixButton.on( 'click', async () => {
    const fixableCount = reports.map( r => r.original.fixableErrorCount )
      .reduce( ( memo, current ) => {
        return memo + current
      }, 0 )

    reports = await fix()
    refresh( reports )
    toast( `Fixed ${ fixableCount } ${ plur( 'issue', fixableCount ) }` )
  } )

  closeButton.on( 'click', () => {
    screen.destroy()
  } )
  // action end

  screen.render()
}

module.exports = render
