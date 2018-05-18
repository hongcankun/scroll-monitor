const pkg = require('../package')
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const uglifyjs = require('uglify-js')
const copyrights = require('./copyrights')

const patterns = ['dist/!(*.min).js', 'dist/!(bundle)/**/!(*.min).js', `${pkg.browser}`]
const pattern = `{${patterns.join(',')}}`
const encoding = 'utf-8'
const defaultUglifyOptions = {
  compress: {
    typeofs: false
  },
  output: {
    preamble: copyrights
  }
}

glob(pattern, function (err, files) {
  if (err) throw err
  files.forEach(file => {

    fs.readFile(file, encoding, (err, data) => {
      if (err) throw err

      const outputPath = file.replace(/.js$/, '.min.js')
      const sourceMapPath = file.replace(/.js$/, '.min.js.map')
      const originSourceMapContent = fs.readFileSync(file.replace(/.js$/, '.js.map'), encoding)

      const sourceMapOptions = {
        sourceMap: {
          filename: path.basename(outputPath),
          url: path.basename(sourceMapPath),
          includeSources: true,
          content: originSourceMapContent
        }
      }
      const options = Object.assign(defaultUglifyOptions, sourceMapOptions)

      const result = uglifyjs.minify(data, options)
      if (result.err) throw result.err

      const code = result.code
      fs.writeFile(outputPath, code, encoding, err => {
        if (err) throw err
      })

      const map = result.map
      fs.writeFile(sourceMapPath, map, encoding, err => {
        if (err) throw err
      })
    })

  })
})
