module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: process.env.BUNDLE ? false : 'umd'
      }
    ]
  ],
  env: {
    test: {
      plugins: ['istanbul']
    }
  }
}
