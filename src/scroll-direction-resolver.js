import Monitor from './monitor'

/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor: scroll-up.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */

/**
 * This resolver can recognize scroll direction of scroll events.
 * @type {ScrollDirectionResolver}
 */
const ScrollDirectionResolver = (() => {

  const Selectors = {
    SCROLL_DIRECTION_MONITOR: '[data-monitor~="scroll-direction"]'
  }

  const Data = {
    SCROLL_UP_CLASSES: 'scrollUpClasses',
    SCROLL_DOWN_CLASSES: 'scrollDownClasses',
    SCROLL_LEFT_CLASSES: 'scrollLeftClasses',
    SCROLL_RIGHT_CLASSES: 'scrollRightClasses'
  }

  const Events = {
    SCROLL_UP: `scroll.up.${Monitor.NAMESPACE}`,
    SCROLL_DOWN: `scroll.down.${Monitor.NAMESPACE}`,
    SCROLL_LEFT: `scroll.left.${Monitor.NAMESPACE}`,
    SCROLL_RIGHT: `scroll.right.${Monitor.NAMESPACE}`,
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  }

  const DEFAULT_INTERVAL = 50

  class ScrollDirectionResolver {

    constructor(interval) {
      this._interval = interval !== undefined ? interval : DEFAULT_INTERVAL
      this._ticking = false
    }

    get interval() {
      return this._interval
    }

    set interval(value) {
      this._interval = value
    }

    get eventTypes() {
      return [Events.SCROLL_UP, Events.SCROLL_DOWN, Events.SCROLL_LEFT, Events.SCROLL_RIGHT]
    }

    static _initByData() {
      function spreadClasses(expression) {
        expression = expression || ''
        return expression.split(/\s+/g).filter(Boolean)
      }

      for (const subscriber of document.querySelectorAll(Selectors.SCROLL_DIRECTION_MONITOR)) {
        const toggleClasses = {
          up: spreadClasses(subscriber.dataset[Data.SCROLL_UP_CLASSES]),
          down: spreadClasses(subscriber.dataset[Data.SCROLL_DOWN_CLASSES]),
          left: spreadClasses(subscriber.dataset[Data.SCROLL_LEFT_CLASSES]),
          right: spreadClasses(subscriber.dataset[Data.SCROLL_RIGHT_CLASSES])
        }

        subscriber.addEventListener(Events.SCROLL_UP, () => {
          subscriber.classList.add(...toggleClasses.up)
          subscriber.classList.remove(...toggleClasses.down)
        })
        subscriber.addEventListener(Events.SCROLL_DOWN, () => {
          subscriber.classList.add(...toggleClasses.down)
          subscriber.classList.remove(...toggleClasses.up)
        })
        subscriber.addEventListener(Events.SCROLL_LEFT, () => {
          subscriber.classList.add(...toggleClasses.left)
          subscriber.classList.remove(...toggleClasses.right)
        })
        subscriber.addEventListener(Events.SCROLL_RIGHT, () => {
          subscriber.classList.add(...toggleClasses.right)
          subscriber.classList.remove(...toggleClasses.left)
        })
      }
    }

    resolve(lastMetric, crtMetric) {
      const events = []

      if (!this._ticking) {
        this._ticking = true
        setTimeout(() => this._ticking = false, this._interval)

        if (crtMetric.top < lastMetric.top) {
          events.push(new Event(Events.SCROLL_UP))
        }
        if (crtMetric.top > lastMetric.top) {
          events.push(new Event(Events.SCROLL_DOWN))
        }
        if (crtMetric.left < lastMetric.left) {
          events.push(new Event(Events.SCROLL_LEFT))
        }
        if (crtMetric.left > lastMetric.left) {
          events.push(new Event(Events.SCROLL_RIGHT))
        }
      }

      return events
    }
  }

  window.addEventListener(Events.DOM_CONTENT_LOADED, () => {
    Monitor.registerResolver(new ScrollDirectionResolver())
    ScrollDirectionResolver._initByData()
  })

  return ScrollDirectionResolver
})()

export default ScrollDirectionResolver
