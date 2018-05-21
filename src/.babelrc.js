module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false
      }
    ]
  ],
  plugins: [
    !process.env.BUNDLE && 'transform-es2015-modules-strip'
  ].filter(Boolean),
  env: {
    test: {
      plugins: ['istanbul']
    }
  }
}
