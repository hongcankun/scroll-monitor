const pkg = require('../package')

const year = new Date().getFullYear()
const copyrights = `/**
 * ScrollMonitor v${pkg.version} (${pkg.homepage})
 * Copyright ${year === 2018 ? '' : '2018-'}${year} ${pkg.author}
 * Licensed under MIT (${pkg.homepage}/blob/master/LICENSE)
 */`

module.exports = copyrights
