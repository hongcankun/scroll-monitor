module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'umd'
      }
    ]
  ],
  env: {
    test: {
      plugins: ['istanbul']
    }
  }
}
