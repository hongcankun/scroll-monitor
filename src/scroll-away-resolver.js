import Monitor from './monitor'

/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor: scroll-away-resolver.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */

/**
 * A resolver used to determine if the target has scrolled over certain distance
 * away from edges, including top, bottom, left, and right edges.
 * @type {ScrollAwayResolver}
 */
const ScrollAwayResolver = (() => {

  const Selectors = {
    SCROLL_AWAY_MONITOR: '[data-monitor~="scroll-away"]'
  }

  const Data = {
    AWAY_TOP: 'awayTop',
    AWAY_BOTTOM: 'awayBottom',
    AWAY_LEFT: 'awayLeft',
    AWAY_RIGHT: 'awayRight',

    DISTANCE_TOP: 'distanceTop',
    DISTANCE_BOTTOM: 'distanceBottom',
    DISTANCE_LEFT: 'distanceLeft',
    DISTANCE_RIGHT: 'distanceRight'
  }

  const Events = {
    SCROLL_AWAY_TOP: `scroll.away.top.${Monitor.NAMESPACE}`,
    SCROLL_AWAY_TOP_OFF: `scroll.away.top.off.${Monitor.NAMESPACE}`,

    SCROLL_AWAY_BOTTOM: `scroll.away.bottom.${Monitor.NAMESPACE}`,
    SCROLL_AWAY_BOTTOM_OFF: `scroll.away.bottom.off.${Monitor.NAMESPACE}`,

    SCROLL_AWAY_LEFT: `scroll.away.left.${Monitor.NAMESPACE}`,
    SCROLL_AWAY_LEFT_OFF: `scroll.away.left.off.${Monitor.NAMESPACE}`,

    SCROLL_AWAY_RIGHT: `scroll.away.right.${Monitor.NAMESPACE}`,
    SCROLL_AWAY_RIGHT_OFF: `scroll.away.right.off.${Monitor.NAMESPACE}`
  }

  const Util = Monitor.Util

  const DEFAULT_DISTANCE = 100

  const DEFAULT_OPTIONS = {
    top: DEFAULT_DISTANCE,
    bottom: DEFAULT_DISTANCE,
    left: DEFAULT_DISTANCE,
    right: DEFAULT_DISTANCE
  }

  class ScrollAwayResolver extends Monitor.BaseResolver {

    constructor(subscriber, interval = null, options) {
      super(subscriber, interval, 50)
      this._options = Object.assign({}, DEFAULT_OPTIONS, options)
    }

    static _initByData() {
      for (const subscriber of document.querySelectorAll(Selectors.SCROLL_AWAY_MONITOR)) {
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
          Monitor.of(target).addResolver(new ScrollAwayResolver(subscriber, interval, options)))

        const toggleClasses = {
          top: Util.splitString(subscriber.dataset[Data.AWAY_TOP]),
          bottom: Util.splitString(subscriber.dataset[Data.AWAY_BOTTOM]),
          left: Util.splitString(subscriber.dataset[Data.AWAY_LEFT]),
          right: Util.splitString(subscriber.dataset[Data.AWAY_RIGHT])
        }

        subscriber.addEventListener(Events.SCROLL_AWAY_TOP, () => {
          subscriber.classList.add(...toggleClasses.top)
        })
        subscriber.addEventListener(Events.SCROLL_AWAY_TOP_OFF, () => {
          subscriber.classList.remove(...toggleClasses.top)
        })

        subscriber.addEventListener(Events.SCROLL_AWAY_BOTTOM, () => {
          subscriber.classList.add(...toggleClasses.bottom)
        })
        subscriber.addEventListener(Events.SCROLL_AWAY_BOTTOM_OFF, () => {
          subscriber.classList.remove(...toggleClasses.bottom)
        })

        subscriber.addEventListener(Events.SCROLL_AWAY_LEFT, () => {
          subscriber.classList.add(...toggleClasses.left)
        })
        subscriber.addEventListener(Events.SCROLL_AWAY_LEFT_OFF, () => {
          subscriber.classList.remove(...toggleClasses.left)
        })

        subscriber.addEventListener(Events.SCROLL_AWAY_RIGHT, () => {
          subscriber.classList.add(...toggleClasses.right)
        })
        subscriber.addEventListener(Events.SCROLL_AWAY_RIGHT_OFF, () => {
          subscriber.classList.remove(...toggleClasses.right)
        })
      }
    }

    _doResolve(events, lastMetric, crtMetric) {
      // scroll vertically
      if (crtMetric.top !== lastMetric.top) {
        if (crtMetric.top >= this._options.top) {
          events.push(new Event(Events.SCROLL_AWAY_TOP))
        } else {
          events.push(new Event(Events.SCROLL_AWAY_TOP_OFF))
        }

        if (crtMetric.bottom >= this._options.bottom) {
          events.push(new Event(Events.SCROLL_AWAY_BOTTOM))
        } else {
          events.push(new Event(Events.SCROLL_AWAY_BOTTOM_OFF))
        }
      }

      // scroll horizontally
      if (crtMetric.left !== lastMetric.left) {
        if (crtMetric.left >= this._options.left) {
          events.push(new Event(Events.SCROLL_AWAY_LEFT))
        } else {
          events.push(new Event(Events.SCROLL_AWAY_LEFT_OFF))
        }

        if (crtMetric.right >= this._options.right) {
          events.push(new Event(Events.SCROLL_AWAY_RIGHT))
        } else {
          events.push(new Event(Events.SCROLL_AWAY_RIGHT_OFF))
        }
      }
    }
  }

  Util.onLoaded(() => ScrollAwayResolver._initByData())

  return ScrollAwayResolver
})()

export default ScrollAwayResolver
