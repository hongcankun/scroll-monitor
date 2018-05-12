import EventResolver from './event-resolver'

const ScrollMonitor = (() => {

  const VERSION = '0.1.0'
  const EventNameSpace = 'scroll-monitor'

  const Selectors = {
    SCROLL_MONITOR: '[data-monitor="scroll"]'
  }

  const Data = {
    TARGET: 'monitor-target'
  }

  const Events = {
    SCROLL: 'scroll',
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  }

  const MonitorMap = new Map()
  const EventResolvers = new Set()
  const ValidTargetTypes = [Window, Element]

  class ScrollMonitor {
    /*
     * The constructor of ScrollMonitor.
     * This method will erase the ScrollMonitor of the target, then return a new one.
     * Consider use ScrollMonitor.of(target) instead.
     */
    constructor(target) {
      target = target || window
      ScrollMonitor._checkTargetValid(target)

      if (MonitorMap.has(target)) {
        MonitorMap.get(target).destroy()
      }

      this._target = target
      this._subscribers = new Set()
      this._scrollMetric = ScrollMonitor._resolveScrollMetric(target)
      this._boundEventListener = this._onTargetScroll.bind(this)

      this._target.addEventListener(Events.SCROLL, this._boundEventListener)
      MonitorMap.set(target, this)
    }

    // Static

    static get VERSION() {
      return VERSION
    }

    static get NAMESPACE() {
      return EventNameSpace
    }

    /*
     * Get the ScrollMonitor of the target.
     * If the ScrollMonitor of the target exists, then return it.
     * Otherwise, create a new ScrollMonitor for the target and return.
     */
    static of(target) {
      ScrollMonitor._checkTargetValid(target)
      if (MonitorMap.has(target)) {
        return MonitorMap.get(target)
      } else {
        return new ScrollMonitor(target)
      }
    }

    /*
     * Register a new EventResolver to ALL ScrollMonitors.
     * If the EventResolver has been registered, invoke this method will not make sense.
     */
    static registerEventResolver(eventResolver) {
      this._checkEventResolverValid(eventResolver)
      EventResolvers.add(eventResolver)
    }

    /*
     * Unregister a EventResolver from ALL ScrollMonitors.
     * If the EventResolver is not registered, invoke this method will not make sense.
     */
    static unregisterEventResolver(eventResolver) {
      EventResolvers.delete(eventResolver)
    }

    static _resolveScrollMetric(target) {
      let scrollMetric
      if (target instanceof Window) {
        scrollMetric = new ScrollMetric(target.innerHeight, target.innerWidth,
          target.pageYOffset, target.pageXOffset)
      } else if (target instanceof Element) {
        scrollMetric = new ScrollMetric(target.scrollHeight, target.scrollWidth,
          target.scrollTop, target.scrollLeft)
      } else {
        throw new Error('Can not resolve ScrollMetric')
      }
      return scrollMetric
    }

    static _checkTargetValid(target) {
      let isValidType = false
      for (const validTargetType of ValidTargetTypes) {
        if (target instanceof validTargetType) {
          isValidType = true
          break
        }
      }
      if (!isValidType) {
        let sValidTargetTypes = []
        for (const validType of ValidTargetTypes) {
          sValidTargetTypes.push(validType.name)
        }
        throw new Error(`The target must be instance of one in ${sValidTargetTypes.join(', ')}!`)
      }
    }

    static _checkSubscriberValid(subscriber) {
      if (!(subscriber instanceof EventTarget)) {
        throw new Error('The subscriber must be instance of EventTarget!')
      }
    }

    static _checkEventResolverValid(eventResolver) {
      if (!(eventResolver instanceof EventResolver)) {
        throw new Error('The event resolver must be instance of EventResolver!')
      }
    }

    // Public

    /*
     * Add a new subscriber to the ScrollMonitor.
     */
    subscribe(subscriber) {
      ScrollMonitor._checkSubscriberValid(subscriber)
      this._subscribers.add(subscriber)
    }

    /*
     * Remove a subscriber from the ScrollMonitor.
     */
    unsubscribe(subscriber) {
      this._subscribers.delete(subscriber)
    }

    /*
     * Destroy the ScrollMonitor.
     * Once invoked this method, the ScrollMonitor would not be available anymore.
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
      const lastScrollMetric = this._scrollMetric
      this._scrollMetric = ScrollMonitor._resolveScrollMetric(this._target)

      for (const eventResolver of EventResolvers) {
        const resolvedEvent = eventResolver.resolve(lastScrollMetric, this._scrollMetric, event)
        if (resolvedEvent && resolvedEvent instanceof Event) {
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
    for (const subscriber of document.querySelectorAll(Selectors.SCROLL_MONITOR)) {
      const targetData = subscriber.dataset[Data.TARGET]
      if (targetData) {
        for (const target of document.querySelectorAll(targetData)) {
          ScrollMonitor.of(target).subscribe(subscriber)
        }
      } else {
        ScrollMonitor.of(window).subscribe(subscriber)
      }
    }
  })

  return ScrollMonitor
})()

export default ScrollMonitor
