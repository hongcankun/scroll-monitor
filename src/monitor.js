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

  const TargetTypes = [Window, Element]
  const Monitors = new Map()

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
     * @param resolver should have a function named resolve
     * @throws when resolver is invalid
     */
    addResolver(resolver) {
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
  }

  return Monitor
})()

export default Monitor
