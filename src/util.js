const Util = (() => {
  const Util = {
    createEvent(type, options) {
      const defaultOptions = {bubbles: false, cancelable: false, composed: false}
      options = Object.assign(defaultOptions, options)
      if (document.documentMode) { // if IE
        const event = document.createEvent('Event')
        event.initEvent(type, options.bubbles, options.cancelable)
        return event
      } else {
        return new Event(type, options)
      }
    }
  }

  return Util
})()

export default Util
