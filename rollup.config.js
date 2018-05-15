import pkg from './package.json'
import babel from 'rollup-plugin-babel'

const year = new Date().getFullYear()
const banner = `/*!
  * ScrollMonitor v${pkg.version} (${pkg.homepage})
  * Copyright ${year === 2018 ? '' : '2018-'}${year} ${pkg.author}
  * Licensed under MIT (${pkg.homepage}/blob/master/LICENSE)
  */`

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'scrollMonitorBundle',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
      banner: banner
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
      format: 'es',
      banner: banner
    }

  }
]
