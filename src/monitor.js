/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor: monitor.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */

const Monitor = (() => {

  const NAMESPACE = 'scroll-monitor'

  const Data = {
    TARGET: 'target',
    INTERVAL: 'interval'
  }

  const Events = {
    SCROLL: 'scroll',
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  }

  const TargetTypes = [Window, Document, Element]
  const Monitors = new Map()

  class BaseResolver {
    constructor(subscirber, interval, defaultInterval = 50) {
      this.subscriber = subscirber
      if (interval !== undefined) {
        interval = Number(interval) > 0 ? Number(interval) : defaultInterval
        this._ticker = {interval: interval, ticking: false}
      }
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

    resolve(lastMetric, crtMetric, event) {
      const events = []
      if (this._ticker !== undefined) {
        if (!this._ticker.ticking) {
          this._ticker.ticking = true
          setTimeout(() => this._ticker.ticking = false, this._ticker.interval)
          this._doResolve(events, lastMetric, crtMetric, event)
        }
      } else {
        this._doResolve(events, lastMetric, crtMetric, event)
      }
      events.forEach(event => this._subscriber.dispatchEvent(event))
    }

    // eslint-disable-next-line no-unused-vars
    _doResolve(events, lastMetric, crtMetric, event) {
      // do nothing
    }
  }

  class Monitor {

    /**
     * Destroy the monitor of the given target if it has been created, then return a new one.
     * Consider use {@link Monitor.of} instead.
     * @param target the target of the monitor
     * @throws when target is invalid
     * @see Monitor.of
     */
    constructor(target) {
      target = target || window
      Monitor._checkTarget(target)

      if (Monitors.has(target)) {
        Monitors.get(target).destroy()
      }

      this._target = target
      this._resolvers = new Set()
      this._scrollMetric = Monitor._resolveMetric(target)
      this._boundEventListener = this._onTargetScroll.bind(this)

      this._target.addEventListener(Events.SCROLL, this._boundEventListener)
      Monitors.set(target, this)
    }

    // Static

    static get Util() {
      return Util
    }

    static get BaseResolver() {
      return BaseResolver
    }

    static get NAMESPACE() {
      return NAMESPACE
    }

    /**
     * @return {Map<Window | Element, Monitor>} a map contains all monitors that has been created.
     */
    static get monitors() {
      return new Map(Monitors)
    }

    /**
     * @return the target of this monitor
     */
    get target() {
      return this._target
    }

    /**
     * @return {Set} a set contains all resolvers of this monitor
     */
    get resolvers() {
      return new Set(this._resolvers)
    }

    /**
     * Get the monitor of the given target.
     * If the monitor of the given target has been created, then return it.
     * Otherwise, create a new monitor for the given target and return.
     * @param target the target of the monitor
     * @throws when target is invalid
     * @return {Monitor} the monitor of the given target
     */
    static of(target) {
      if (Monitors.has(target)) {
        return Monitors.get(target)
      } else {
        return new Monitor(target)
      }
    }

    /**
     * Destroy all monitors that has been created.
     */
    static clear() {
      Monitors.forEach(monitor => monitor.destroy())
    }

    static _resolveMetric(target) {
      let metric
      if (target instanceof Window) {
        const rootElement = target.document.documentElement
        metric = new ScrollMetric(
          rootElement.scrollHeight, rootElement.scrollWidth,
          rootElement.clientHeight, rootElement.clientWidth,
          target.pageYOffset, target.pageXOffset)
      } else if (target instanceof Element) {
        metric = new ScrollMetric(
          target.scrollHeight, target.scrollWidth,
          target.clientHeight, target.clientWidth,
          target.scrollTop, target.scrollLeft
        )
      } else {
        throw new Error('Can not resolve ScrollMetric')
      }
      return metric
    }

    static _checkTarget(target) {
      for (const type of TargetTypes) {
        if (target instanceof type) {
          return
        }
      }
      throw new Error(`The target must be an instance of one in ${TargetTypes.map(type => type.name).join(', ')}!`)
    }

    // Public

    /**
     * Add a resolver to this monitor.
     * @param resolver should be a function or an object that have a function named resolve
     * @throws when resolver is invalid
     */
    addResolver(resolver) {
      if (typeof resolver === 'function') {
        resolver = {resolve: resolver}
      }
      if (typeof resolver.resolve !== 'function') {
        throw new Error('The resolver should have a function named resolve!')
      }
      this._resolvers.add(resolver)
    }

    /**
     * Remove a resolver from this monitor.
     * @return true the resolver has been removed successfully
     */
    removeResolver(resolver) {
      return this._resolvers.delete(resolver)
    }

    /**
     * Remove all resolvers of this monitor.
     * @return {Set} removed resolvers of this monitor
     */
    clearResolvers() {
      const resolvers = this._resolvers
      this._resolvers = new Set()
      return resolvers
    }

    /**
     * Destroy the monitor.
     * This monitor would not be available anymore after this method has been called.
     */
    destroy() {
      Monitors.delete(this._target)
      this._target.removeEventListener(Events.SCROLL, this._boundEventListener)

      this._target = null
      this._resolvers = null
      this._scrollMetric = null
      this._boundEventListener = null
    }

    // Private

    _onTargetScroll(event) {
      const lastMetric = this._scrollMetric
      this._scrollMetric = Monitor._resolveMetric(this._target)

      for (const resolver of this._resolvers) {
        resolver.resolve(lastMetric, this._scrollMetric, event)
      }
    }

  }

  class ScrollMetric {
    constructor(scrollHeight, scrollWidth, viewHeight, viewWidth, top, left) {
      this._scrollHeight = scrollHeight
      this._scrollWidth = scrollWidth
      this._viewHeight = viewHeight
      this._viewWidth = viewWidth
      this._top = top
      this._left = left
    }

    // Getter

    get scrollHeight() {
      return this._scrollHeight
    }

    get scrollWidth() {
      return this._scrollWidth
    }

    get viewHeight() {
      return this._viewHeight
    }

    get viewWidth() {
      return this._viewWidth
    }

    get top() {
      return this._top
    }

    get left() {
      return this._left
    }

    get bottom() {
      return this._scrollHeight - this._top - this._viewHeight
    }

    get right() {
      return this._scrollWidth - this._left - this._viewWidth
    }
  }

  /**
   * Utility for resolvers.
   */
  const Util = {
    /**
     * Notify listener when the content of dom has been loaded.
     * @param listener the listener to be notified
     */
    onLoaded: function (listener) {
      window.addEventListener(Events.DOM_CONTENT_LOADED, listener)
    },
    /**
     * A convenient function to split string by supplied pattern.
     * @param string the string to be split
     * @param pattern the split pattern
     * @return {string[]}
     */
    splitString: function (string, pattern = /\s+/g) {
      string = string || ''
      return string.split(pattern).filter(Boolean)
    },
    /**
     * Get the targets of the subscriber by data attribute.
     * @param subscriber the subscriber of the scroll monitor
     * @param dataAttr the data attribute that contains the targets
     * @return {Array} the targets of the subscriber
     */
    getTargets: function (subscriber, dataAttr = Data.TARGET) {
      const targetData = subscriber.dataset[dataAttr]
      return targetData ? document.querySelectorAll(targetData) : [window]
    },
    /**
     * Get the ticking interval of the subscriber by data attribute.
     * @param subscriber the subscriber of the scroll monitor
     * @param dataAttr the data attribute contains the interval
     * @return {string | undefined}
     */
    getInterval: function (subscriber, dataAttr = Data.INTERVAL) {
      return subscriber.dataset[dataAttr]
    }
  }

  return Monitor
})()

export default Monitor
