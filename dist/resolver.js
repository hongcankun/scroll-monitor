function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor (v0.1.0): resolver.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */
var Resolver = function () {
  var VERSION = '0.1.0'
  var EVENT_NAMESPACE = 'scroll-monitor'

  var Resolver =
    /*#__PURE__*/
    function () {
      function Resolver() {
        _classCallCheck(this, Resolver)
      }

      _createClass(Resolver, [{
        key: 'resolve',
        // Public

        /**
         * Resolve metrics and event received from Monitor and
         * return a new resolved Event which should be dispatched to subscribers of Monitor
         * @param lastMetric last scroll metric
         * @param crtMetric current scroll metric
         * @param event the scroll event that monitor received
         * @return {Event}
         */
        value: function resolve(lastMetric, crtMetric, event) {
          // eslint-disable-line no-unused-vars
          throw new Error('Method is not implemented. Instance must override this method to resolve scroll event!')
        }
      }, {
        key: 'eventTypes',

        /**
         * Return an array of event types this revolver will generate
         */
        get: function get() {
        }
      }], [{
        key: 'VERSION',
        // Getter
        get: function get() {
          return VERSION
        }
      }, {
        key: 'NAMESPACE',
        get: function get() {
          return EVENT_NAMESPACE
        }
      }])

      return Resolver
    }()

  return Resolver
}()
//# sourceMappingURL=resolver.js.map
