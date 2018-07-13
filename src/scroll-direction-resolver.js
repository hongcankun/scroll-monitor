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
    SCROLL_UP: 'scrollUp',
    SCROLL_DOWN: 'scrollDown',
    SCROLL_LEFT: 'scrollLeft',
    SCROLL_RIGHT: 'scrollRight'
  }

  const Events = {
    SCROLL_UP: `scroll.up.${Monitor.NAMESPACE}`,
    SCROLL_DOWN: `scroll.down.${Monitor.NAMESPACE}`,
    SCROLL_LEFT: `scroll.left.${Monitor.NAMESPACE}`,
    SCROLL_RIGHT: `scroll.right.${Monitor.NAMESPACE}`
  }

  const Util = Monitor.Util

  class ScrollDirectionResolver extends Monitor.BaseResolver {

    constructor(subscriber, interval = null) {
      super(subscriber, interval)
    }

    static _initByData() {
      for (const subscriber of document.querySelectorAll(Selectors.SCROLL_DIRECTION_MONITOR)) {
        const interval = Util.getInterval(subscriber)
        Util.getTargets(subscriber).forEach(target =>
          Monitor.of(target).addResolver(new ScrollDirectionResolver(subscriber, interval)))

        const toggleClasses = {
          up: Util.splitString(subscriber.dataset[Data.SCROLL_UP]),
          down: Util.splitString(subscriber.dataset[Data.SCROLL_DOWN]),
          left: Util.splitString(subscriber.dataset[Data.SCROLL_LEFT]),
          right: Util.splitString(subscriber.dataset[Data.SCROLL_RIGHT])
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

    _doResolve(events, lastMetric, crtMetric) {
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
  }

  Util.onLoaded(() => ScrollDirectionResolver._initByData())

  return ScrollDirectionResolver
})()

export default ScrollDirectionResolver
