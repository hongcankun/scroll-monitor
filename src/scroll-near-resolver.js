import Monitor from './monitor'

/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor: scroll-near-resolver.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */

/**
 * A resolver used to determine it the target is scrolling towards edges and
 * within certain distance, including top, bottom, left, and right edges.
 * @type {ScrollNearResolver}
 */
const ScrollNearResolver = (() => {

  const Selectors = {
    SCROLL_NEAR_MONITOR: '[data-monitor~="scroll-near"]'
  }

  const Data = {
    NEAR_TOP: 'nearTop',
    NEAR_BOTTOM: 'nearBottom',
    NEAR_LEFT: 'nearLeft',
    NEAR_RIGHT: 'nearRight',
    DISTANCE_TOP: 'distanceTop',
    DISTANCE_BOTTOM: 'distanceBottom',
    DISTANCE_LEFT: 'distanceLeft',
    DISTANCE_RIGHT: 'distanceRight'
  }

  const Events = {
    SCROLL_NEAR_TOP: `scroll.near.top.${Monitor.NAMESPACE}`,
    SCROLL_NEAR_BOTTOM: `scroll.near.bottom.${Monitor.NAMESPACE}`,
    SCROLL_NEAR_LEFT: `scroll.near.left.${Monitor.NAMESPACE}`,
    SCROLL_NEAR_RIGHT: `scroll.near.right.${Monitor.NAMESPACE}`
  }

  const Util = Monitor.Util

  const DEFAULT_DISTANCE = 100

  const DEFAULT_OPTIONS = {
    top: DEFAULT_DISTANCE,
    bottom: DEFAULT_DISTANCE,
    left: DEFAULT_DISTANCE,
    right: DEFAULT_DISTANCE
  }

  class ScrollNearResolver extends Monitor.BaseResolver {

    constructor(subscriber, interval = null, options) {
      super(subscriber, interval, 10)
      this._options = Object.assign({}, DEFAULT_OPTIONS, options)
    }

    static _initByData() {
      for (const subscriber of document.querySelectorAll(Selectors.SCROLL_NEAR_MONITOR)) {
        const interval = Util.getInterval(subscriber)
        const options = {
          top: Number(subscriber.dataset[Data.DISTANCE_TOP]),
          bottom: Number(subscriber.dataset[Data.DISTANCE_BOTTOM]),
          left: Number(subscriber.dataset[Data.DISTANCE_LEFT]),
          right: Number(subscriber.dataset[Data.DISTANCE_RIGHT])
        }
        Object.keys(options).forEach(key =>
          (options[key] === undefined || Number.isNaN(options[key]) || options[key] < 0)
          && delete options[key])

        Util.getTargets(subscriber).forEach(target =>
          Monitor.of(target).addResolver(new ScrollNearResolver(subscriber, interval, options)))

        const toggleClasses = {
          top: Util.splitString(subscriber.dataset[Data.NEAR_TOP]),
          bottom: Util.splitString(subscriber.dataset[Data.NEAR_BOTTOM]),
          left: Util.splitString(subscriber.dataset[Data.NEAR_LEFT]),
          right: Util.splitString(subscriber.dataset[Data.NEAR_RIGHT])
        }

        subscriber.addEventListener(Events.SCROLL_NEAR_TOP, () => {
          subscriber.classList.add(...toggleClasses.top)
          subscriber.classList.remove(...toggleClasses.bottom)
        })
        subscriber.addEventListener(Events.SCROLL_NEAR_BOTTOM, () => {
          subscriber.classList.add(...toggleClasses.bottom)
          subscriber.classList.remove(...toggleClasses.top)
        })
        subscriber.addEventListener(Events.SCROLL_NEAR_LEFT, () => {
          subscriber.classList.add(...toggleClasses.left)
          subscriber.classList.remove(...toggleClasses.right)
        })
        subscriber.addEventListener(Events.SCROLL_NEAR_RIGHT, () => {
          subscriber.classList.add(...toggleClasses.right)
          subscriber.classList.remove(...toggleClasses.left)
        })
      }
    }

    _doResolve(events, lastMetric, crtMetric) {
      if (crtMetric.top < lastMetric.top && crtMetric.top <= this._options.top) {
        events.push(new Event(Events.SCROLL_NEAR_TOP))
      }
      if (crtMetric.top > lastMetric.top && crtMetric.bottom <= this._options.bottom) {
        events.push(new Event(Events.SCROLL_NEAR_BOTTOM))
      }
      if (crtMetric.left < lastMetric.left && crtMetric.left <= this._options.left) {
        events.push(new Event(Events.SCROLL_NEAR_LEFT))
      }
      if (crtMetric.left > lastMetric.left && crtMetric.right <= this._options.right) {
        events.push(new Event(Events.SCROLL_NEAR_RIGHT))
      }
    }
  }

  Util.onLoaded(() => ScrollNearResolver._initByData())

  return ScrollNearResolver
})()

export default ScrollNearResolver
