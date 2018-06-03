import Util from './util'
import Resolver from './resolver'
import Monitor from './monitor'

/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor (v0.1.0): scroll-up.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */

const ScrollUpResolver = (() => {

  const VERSION = '0.1.0'

  const Selectors = {
    SCROLL_UP_MONITOR: '[data-monitor~="scroll-up"]'
  }

  const Data = {
    TOGGLE_CLASS: 'scrollUpClass'
  }

  const DataDefault = {
    TOGGLE_CLASS: 'scroll-up'
  }

  const Events = {
    SCROLL_UP: `scroll.up.${Resolver.NAMESPACE}`,
    SCROLL_UP_OFF: `scroll.up.off.${Resolver.NAMESPACE}`,
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  }

  class ScrollUpResolver extends Resolver {

    static get VERSION() {
      return VERSION
    }

    get eventTypes() {
      return [Events.SCROLL_UP, Events.SCROLL_UP_OFF]
    }

    /**
     * Add class toggle event listeners those respond to events of {@link ScrollUpResolver} to subscribers by data attributes.
     * This function can NOT be invoked repeatedly safely, event listeners will be registered repeatedly.
     */
    static _initByData() {
      for (const subscriber of document.querySelectorAll(Selectors.SCROLL_UP_MONITOR)) {
        const toggleClass = subscriber.dataset[Data.TOGGLE_CLASS] || DataDefault.TOGGLE_CLASS
        subscriber.addEventListener(Events.SCROLL_UP, () => {
          subscriber.classList.add(toggleClass)
        })
        subscriber.addEventListener(Events.SCROLL_UP_OFF, () => {
          subscriber.classList.remove(toggleClass)
        })
      }
    }

    resolve(lastMetric, crtMetric) {
      let lastTop = lastMetric.top
      let crtTop = crtMetric.top
      if (crtTop < lastTop) {
        return Util.createEvent(Events.SCROLL_UP)
      } else {
        return Util.createEvent(Events.SCROLL_UP_OFF)
      }
    }
  }

  window.addEventListener(Events.DOM_CONTENT_LOADED, () => {
    Monitor.registerResolver(new ScrollUpResolver())
    ScrollUpResolver._initByData()
  })

  return ScrollUpResolver
})()

export default ScrollUpResolver
