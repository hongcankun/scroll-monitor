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
    SCROLL_UP_CLASS: 'scrollUpClass',
    SCROLL_DOWN_CLASS: 'scrollDownClass',
    SCROLL_LEFT_CLASS: 'scrollLeftClass',
    SCROLL_RIGHT_CLASS: 'scrollRightClass'
  }

  const DataDefault = {
    SCROLL_UP_CLASS: 'scroll-up',
    SCROLL_DOWN_CLASS: 'scroll-down',
    SCROLL_LEFT_CLASS: 'scroll-left',
    SCROLL_RIGHT_CLASS: 'scroll-right'
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

    /**
     * Add class toggle event listeners those respond to events of
     * {@link ScrollDirectionResolver} to subscribers by data attributes.
     * This function can NOT be invoked repeatedly safely, event listeners will be registered repeatedly.
     */
    static _initByData() {
      for (const subscriber of document.querySelectorAll(Selectors.SCROLL_DIRECTION_MONITOR)) {
        const toggleClasses = {
          up: subscriber.dataset[Data.SCROLL_UP_CLASS] || DataDefault.SCROLL_UP_CLASS,
          down: subscriber.dataset[Data.SCROLL_DOWN_CLASS] || DataDefault.SCROLL_DOWN_CLASS,
          left: subscriber.dataset[Data.SCROLL_LEFT_CLASS] || DataDefault.SCROLL_LEFT_CLASS,
          right: subscriber.dataset[Data.SCROLL_RIGHT_CLASS] || DataDefault.SCROLL_RIGHT_CLASS
        }

        subscriber.addEventListener(Events.SCROLL_UP, () => {
          subscriber.classList.add(toggleClasses.up)
          subscriber.classList.remove(toggleClasses.down)
        })
        subscriber.addEventListener(Events.SCROLL_DOWN, () => {
          subscriber.classList.add(toggleClasses.down)
          subscriber.classList.remove(toggleClasses.up)
        })
        subscriber.addEventListener(Events.SCROLL_LEFT, () => {
          subscriber.classList.add(toggleClasses.left)
          subscriber.classList.remove(toggleClasses.right)
        })
        subscriber.addEventListener(Events.SCROLL_RIGHT, () => {
          subscriber.classList.add(toggleClasses.right)
          subscriber.classList.remove(toggleClasses.left)
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
