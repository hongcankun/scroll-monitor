import pkg from '../package.json'
import babel from 'rollup-plugin-babel'

const copyrights = require('./copyrights')

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'scrollMonitorBundle',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
      banner: copyrights
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es'
    }

  }
]
