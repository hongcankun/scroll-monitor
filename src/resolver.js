/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor (v0.1.0): resolver.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */

const Resolver = (() => {

  const VERSION = '0.1.0'
  const EVENT_NAMESPACE = 'scroll-monitor'

  class Resolver {
    // Getter

    static get VERSION() {
      return VERSION
    }

    static get NAMESPACE() {
      return EVENT_NAMESPACE
    }

    /**
     * Return an array of event types this revolver will generate
     */
    get eventTypes() {
    }

    // Public

    /**
     * Resolve metrics and event received from Monitor and
     * return a new resolved Event which should be dispatched to subscribers of Monitor
     * @param lastMetric last scroll metric
     * @param crtMetric current scroll metric
     * @param event the scroll event that monitor received
     * @return {Event}
     */
    resolve(lastMetric, crtMetric, event) { // eslint-disable-line no-unused-vars
      throw new Error('Method is not implemented. Instance must override this method to resolve scroll event!')
    }
  }

  return Resolver
})()

export default Resolver
