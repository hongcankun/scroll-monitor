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
    TOGGLE_CLASS: 'active'
  }

  const Events = {
    SCROLL_UP: `scroll.up.${Resolver.NAMESPACE}`,
    SCROLL_UP_OFF: `scroll.up.off.${Resolver.NAMESPACE}`,
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  }

  class ScrollUpResolver extends Resolver {
    // Getter

    get eventTypes() {
      return [Events.SCROLL_UP, Events.SCROLL_UP_OFF]
    }

    static VERSION() {
      return VERSION
    }

    // Public

    resolve(lastMetric, crtMetric) {
      let lastTop = lastMetric.top
      let crtTop = crtMetric.top
      if (crtTop < lastTop) {
        return new Event(Events.SCROLL_UP)
      } else {
        return new Event(Events.SCROLL_UP_OFF)
      }
    }
  }

  window.addEventListener(Events.DOM_CONTENT_LOADED, () => {
    Monitor.registerResolver(new ScrollUpResolver())
    for (const subscriber of document.querySelectorAll(Selectors.SCROLL_UP_MONITOR)) {
      const toggleClass = subscriber.dataset[Data.TOGGLE_CLASS] || DataDefault.TOGGLE_CLASS
      subscriber.addEventListener(Events.SCROLL_UP, () => {
        subscriber.classList.add(toggleClass)
      })
      subscriber.addEventListener(Events.SCROLL_UP_OFF, () => {
        subscriber.classList.remove(toggleClass)
      })
    }
  })

  return ScrollUpResolver
})()

export default ScrollUpResolver
