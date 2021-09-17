# eslint-dashboard

Interactive ESLint workflow that lives in your terminal

<img src="screenshots/dashboard.gif" width="560" />

# Installation

```bash
npm i eslint-dashboard -g
```

# Usage

```bash
# Run command
eslint-dashboard
```

# API

```js
const dashboard = require( 'eslint-dashboard' )

// files: the same as first parameter of eslint.lintFiles
// lint and fix: the same as `lintFiles` and `fixFiles` in `lib/lint.js`
dashboard( files, {
  lint() {
    // implement your own lint logic
    // return eslint lint results
  },
  fix() {
    // implement your own fix logic
    // return eslint fix results
  }
} )
```

# License

MIT
