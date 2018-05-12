import ScrollMonitor from '../scroll-monitor'
import EventResolver from '../event-resolver'

const ScrollUpEventResolver = (() => {

  const VERSION = '0.1.0'

  const Selectors = {
    SCROLL_UP_MONITOR: '[data-monitor~="scroll-up"]'
  }

  const Data = {
    TOGGLE_CLASS: 'toggleClass'
  }

  const DataDefault = {
    TOGGLE_CLASS: 'active'
  }

  const Events = {
    SCROLL_UP: `scroll.up.${ScrollMonitor.NAMESPACE}`,
    SCROLL_UP_OFF: `scroll.up.off.${ScrollMonitor.NAMESPACE}`,
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  }

  class ScrollUpEventResolver extends EventResolver {
    // Getter

    get eventTypes() {
      return [Events.SCROLL_UP, Events.SCROLL_UP_OFF]
    }

    static VERSION() {
      return VERSION
    }

    // Public

    resolve(lastScrollMetric, currentScrollMetric) {
      let lastTop = lastScrollMetric.top
      let crtTop = currentScrollMetric.top
      if (crtTop < lastTop) {
        return new Event(Events.SCROLL_UP)
      } else {
        return new Event(Events.SCROLL_UP_OFF)
      }
    }
  }

  window.addEventListener(Events.DOM_CONTENT_LOADED, () => {
    ScrollMonitor.registerEventResolver(new ScrollUpEventResolver())
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

  return ScrollUpEventResolver
})()

export default ScrollUpEventResolver
