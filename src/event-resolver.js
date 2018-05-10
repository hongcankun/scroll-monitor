/* eslint no-unused-vars:off */

const EventResolver = (() => {

  const VERSION = '0.1.0'

  class EventResolver {
    constructor(eventType) {
      this._eventType = eventType
    }

    // Getter
    //

    static get VERSION() {
      return VERSION
    }

    get eventType() {
      return this._eventType
    }

    // Public
    //

    /*
    *
    */
    resolve(lastScrollMetric, currentScrollMetric, event) {
      throw new Error('Method is not implemented. Subclass must override this method to resolve scroll event!')
    }
  }

  return EventResolver
})()

export default EventResolver
