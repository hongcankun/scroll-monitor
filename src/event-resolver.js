/* eslint no-unused-vars:off */

const EventResolver = (() => {

  const VERSION = '0.1.0'

  class EventResolver {
    constructor(eventType) {
      this._eventType = eventType
    }

    // Getter

    static get VERSION() {
      return VERSION
    }

    get eventType() {
      return this._eventType
    }

    // Public

    /*
    * Resolve metrics and event received from ScrollMonitor and
    * return a new resolved Event which should be dispatched to subscribers
    */
    resolve(lastScrollMetric, currentScrollMetric, event) {
      throw new Error('Method is not implemented. Subclass must override this method to resolve scroll event!')
    }
  }

  return EventResolver
})()

export default EventResolver
