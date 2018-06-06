/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor (v0.1.0): monitor.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */

const Monitor = (() => {

  const VERSION = '0.1.0'
  const EVENT_NAMESPACE = 'scroll-monitor'

  const Selectors = {
    SCROLL_MONITOR: '[data-monitor~="scroll"]'
  }

  const Data = {
    MONITOR_TARGET: 'monitorTarget'
  }

  const Events = {
    SCROLL: 'scroll',
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  }

  const ValidTargetTypes = [Window, Element]

  const MonitorMap = new Map()
  const Resolvers = new Set()

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
      this._subscribers = new Set()
      this._scrollMetric = Monitor._resolveMetric(target)
      this._boundEventListener = this._onTargetScroll.bind(this)

      this._target.addEventListener(Events.SCROLL, this._boundEventListener)
      MonitorMap.set(target, this)
    }

    // Static

    static get VERSION() {
      return VERSION
    }

    static get NAMESPACE() {
      return EVENT_NAMESPACE
    }

    /**
     * Return the copy of the monitor map whose keys are targets and values are monitors
     * @return {Map<Window | Element, Monitor>}
     */
    static get monitorMap() {
      return new Map(MonitorMap)
    }

    /**
     * Return the copy of a Set contains all registered resolvers
     * @return {Set<Resolver>}
     */
    static get resolvers() {
      return new Set(Resolvers)
    }

    /**
     * Get the Monitor of the target.
     * If the Monitor of the target exists, then return it.
     * Otherwise, create a new Monitor for the target and return.
     * @param target target of the monitor
     * @throws when target is not valid
     * @return {Monitor}
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
     * Register a new Resolver
     * @param resolver should be an instance of {@link Resolver}
     * @throws when resolver is not valid
     */
    static registerResolver(resolver) {
      this._checkResolver(resolver)
      Resolvers.add(resolver)
    }

    /**
     * Unregister a resolver
     * @param resolver the resolver should be unregistered
     */
    static unregisterResolver(resolver) {
      Resolvers.delete(resolver)
    }

    /**
     * Destroy all managed Monitors and unregister all Resolvers
     */
    static reset() {
      MonitorMap.forEach(monitor => monitor.destroy())
      Resolvers.clear()
    }

    /**
     * Create monitors and add subscribers to monitors by data attributes.
     * This function can be invoked repeatedly safely, subscribers will not be registered repeatedly.
     */
    static _initByData() {
      for (const subscriber of document.querySelectorAll(Selectors.SCROLL_MONITOR)) {
        const targetData = subscriber.dataset[Data.MONITOR_TARGET]
        if (targetData) {
          for (const target of document.querySelectorAll(targetData)) {
            Monitor.of(target).subscribe(subscriber)
          }
        } else {
          Monitor.of(window).subscribe(subscriber)
        }
      }
    }

    static _resolveMetric(target) {
      let metric
      if (target instanceof Window) {
        metric = new ScrollMetric(target.innerHeight, target.innerWidth,
          target.pageYOffset, target.pageXOffset)
      } else if (target instanceof Element) {
        metric = new ScrollMetric(target.scrollHeight, target.scrollWidth,
          target.scrollTop, target.scrollLeft)
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

    static _checkSubscriber(subscriber) {
      if (!(subscriber instanceof EventTarget)) {
        throw new Error('The subscriber must be an instance of EventTarget!')
      }
    }

    static _checkResolver(resolver) {
      if (typeof resolver.resolve !== 'function') {
        throw new Error('The resolver must have function resolve!')
      }
    }

    // Public

    /**
     * Add a new subscriber to the Monitor.
     * @param subscriber should be an instance of {@link EventTarget}
     * @throws when subscriber is not valid
     */
    subscribe(subscriber) {
      Monitor._checkSubscriber(subscriber)
      this._subscribers.add(subscriber)
    }

    /**
     * Remove a subscriber from the Monitor.
     * @param subscriber the subscriber should be removed from the monitor
     */
    unsubscribe(subscriber) {
      this._subscribers.delete(subscriber)
    }

    /**
     * Destroy the Monitor.
     * Once this method invoked, this Monitor would not be available anymore.
     */
    destroy() {
      MonitorMap.delete(this._target)
      this._target.removeEventListener(Events.SCROLL, this._boundEventListener)

      this._target = null
      this._subscribers = null
      this._scrollMetric = null
      this._boundEventListener = null
    }

    // Private

    _onTargetScroll(event) {
      const lastMetric = this._scrollMetric
      this._scrollMetric = Monitor._resolveMetric(this._target)

      for (const resolver of Resolvers) {
        const resolvedEvents = resolver.resolve(lastMetric, this._scrollMetric, event)
        for (const resolvedEvent of resolvedEvents) {
          for (const subscriber of this._subscribers) {
            subscriber.dispatchEvent(resolvedEvent)
          }
        }
      }
    }

  }

  class ScrollMetric {
    constructor(height, width, top, left) {
      this._height = height
      this._width = width
      this._top = top
      this._left = left
    }

    // Getter

    get height() {
      return this._height
    }

    get width() {
      return this._width
    }

    get top() {
      return this._top
    }

    get left() {
      return this._left
    }
  }

  window.addEventListener(Events.DOM_CONTENT_LOADED, () => {
    Monitor._initByData()
  })

  return Monitor
})()

export default Monitor
