/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor: monitor.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */

const Monitor = (() => {

  const NAMESPACE = 'scroll-monitor'

  const Events = {
    SCROLL: 'scroll',
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  }

  const ValidTargetTypes = [Window, Element]
  const MonitorMap = new Map()

  class Monitor {

    /**
     * This method will destroy the Monitor of the target if exists, then return a new one.
     * Consider use {@link Monitor.of} instead.
     * @param target the target of the monitor
     * @throws when target is invalid
     * @see Monitor.of
     */
    constructor(target) {
      target = target || window
      Monitor._checkTarget(target)

      if (MonitorMap.has(target)) {
        MonitorMap.get(target).destroy()
      }

      this._target = target
      this._resolvers = new Set()
      this._scrollMetric = Monitor._resolveMetric(target)
      this._boundEventListener = this._onTargetScroll.bind(this)

      this._target.addEventListener(Events.SCROLL, this._boundEventListener)
      MonitorMap.set(target, this)
    }

    // Static

    static get NAMESPACE() {
      return NAMESPACE
    }

    /**
     * @return {Map<Window | Element, Monitor>} the copy of the monitor map whose keys are targets and values are monitors
     */
    static get monitorMap() {
      return new Map(MonitorMap)
    }

    /**
     * @returns target of this monitor
     */
    get target() {
      return this._target
    }

    /**
     * @returns {Set} the copy of a Set contains all registered resolvers of this Monitor
     */
    get resolvers() {
      return new Set(this._resolvers)
    }

    /**
     * Get the Monitor of the target.
     * If the Monitor of the target exists, then return it.
     * Otherwise, create a new Monitor for the target and return.
     * @param target target of the monitor
     * @throws when target is not valid
     * @return {Monitor} the Monitor of the target
     */
    static of(target) {
      Monitor._checkTarget(target)
      if (MonitorMap.has(target)) {
        return MonitorMap.get(target)
      } else {
        return new Monitor(target)
      }
    }

    /**
     * Destroy all managed Monitors.
     */
    static reset() {
      MonitorMap.forEach(monitor => monitor.destroy())
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
      for (const type of ValidTargetTypes) {
        if (target instanceof type) {
          return
        }
      }
      throw new Error(`The target must be an instance of one in ${ValidTargetTypes.map(type => type.name).join(', ')}!`)
    }

    // Public

    static _checkResolver(resolver) {
      if (typeof resolver.resolve !== 'function') {
        throw new Error('The resolver must have function resolve!')
      }
    }

    /**
     * Register a resolver to this Monitor.
     * @param resolver should have a function named resolve
     * @throws when resolver is not valid
     */
    registerResolver(resolver) {
      Monitor._checkResolver(resolver)
      this._resolvers.add(resolver)
    }

    /**
     * Unregister a resolver from this Monitor.
     * @return true the resolver has been removed successfully
     */
    unregisterResolver(resolver) {
      return this._resolvers.delete(resolver)
    }

    /**
     * Destroy the Monitor.
     * Once this method invoked, this Monitor would not be available anymore.
     */
    destroy() {
      MonitorMap.delete(this._target)
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
  }

  return Monitor
})()

export default Monitor
