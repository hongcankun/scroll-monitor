const Util = (() => {

  const Util = {
    extendFn(fn, extend, thisArg) {
      thisArg = thisArg || this
      fn.apply(thisArg, arguments)
      extend.apply(thisArg, arguments)
    }
  }

  return Util
})()

export default Util
