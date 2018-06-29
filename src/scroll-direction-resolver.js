import Monitor from './monitor'

/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor: scroll-direction-resolver.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */

/**
 * This resolver can recognize scroll direction.
 * @type {ScrollDirectionResolver}
 */
const ScrollDirectionResolver = (() => {

  const Selectors = {
    SCROLL_DIRECTION_MONITOR: '[data-monitor~="scroll-direction"]'
  }

  const Data = {
    TARGET: 'target',
    INTERVAL: 'interval',
    SCROLL_UP: 'scrollUp',
    SCROLL_DOWN: 'scrollDown',
    SCROLL_LEFT: 'scrollLeft',
    SCROLL_RIGHT: 'scrollRight'
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

    constructor(subscriber, interval) {
      this.subscriber = subscriber
      this.interval = interval
      this._ticking = false
    }

    get subscriber() {
      return this._subscriber
    }

    set subscriber(subscriber) {
      if (!(subscriber instanceof EventTarget)) {
        throw new Error('The subscriber must be an instance of EventTarget!')
      }
      this._subscriber = subscriber
    }

    get interval() {
      return this._interval
    }

    set interval(interval) {
      this._interval = Number(interval) || DEFAULT_INTERVAL
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
        const interval = subscriber.dataset[Data.INTERVAL]
        const targetData = subscriber.dataset[Data.TARGET]
        const targets = targetData ? document.querySelectorAll(targetData) : [window]
        for (const target of targets) {
          Monitor.of(target).addResolver(new ScrollDirectionResolver(subscriber, interval))
        }

        const toggleClasses = {
          up: spreadClasses(subscriber.dataset[Data.SCROLL_UP]),
          down: spreadClasses(subscriber.dataset[Data.SCROLL_DOWN]),
          left: spreadClasses(subscriber.dataset[Data.SCROLL_LEFT]),
          right: spreadClasses(subscriber.dataset[Data.SCROLL_RIGHT])
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

      for (let event of events) {
        this._subscriber.dispatchEvent(event)
      }
    }
  }

  window.addEventListener(Events.DOM_CONTENT_LOADED, () => {
    ScrollDirectionResolver._initByData()
  })

  return ScrollDirectionResolver
})()

export default ScrollDirectionResolver
