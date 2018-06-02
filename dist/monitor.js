function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor (v0.1.0): monitor.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */
var Monitor = function () {
  var VERSION = '0.1.0';
  var Selectors = {
    SCROLL_MONITOR: '[data-monitor~="scroll"]'
  };
  var Data = {
    MONITOR_TARGET: 'monitorTarget'
  };
  var Events = {
    SCROLL: 'scroll',
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  };
  var ValidTargetTypes = [Window, Element];
  var MonitorMap = new Map();
  var Resolvers = new Set();

  var Monitor =
  /*#__PURE__*/
  function () {
    /**
     * This method will destroy the Monitor of the target if exists, then return a new one.
     * Consider use {@link Monitor.of} instead.
     * @param target the target of the monitor
     * @throws when target is invalid
     * @see Monitor.of
     */
    function Monitor(target) {
      _classCallCheck(this, Monitor);

      target = target || window;

      Monitor._checkTarget(target);

      if (MonitorMap.has(target)) {
        MonitorMap.get(target).destroy();
      }

      this._target = target;
      this._subscribers = new Set();
      this._scrollMetric = Monitor._resolveMetric(target);
      this._boundEventListener = this._onTargetScroll.bind(this);

      this._target.addEventListener(Events.SCROLL, this._boundEventListener);

      MonitorMap.set(target, this);
    } // Static


    _createClass(Monitor, [{
      key: "subscribe",
      // Public

      /**
       * Add a new subscriber to the Monitor.
       * @param subscriber should be an instance of {@link EventTarget}
       * @throws when subscriber is not valid
       */
      value: function subscribe(subscriber) {
        Monitor._checkSubscriber(subscriber);

        this._subscribers.add(subscriber);
      }
      /**
       * Remove a subscriber from the Monitor.
       * @param subscriber the subscriber should be removed from the monitor
       */

    }, {
      key: "unsubscribe",
      value: function unsubscribe(subscriber) {
        this._subscribers.delete(subscriber);
      }
      /**
       * Destroy the Monitor.
       * Once this method invoked, this Monitor would not be available anymore.
       */

    }, {
      key: "destroy",
      value: function destroy() {
        MonitorMap.delete(this._target);

        this._target.removeEventListener(Events.SCROLL, this._boundEventListener);

        this._target = null;
        this._subscribers = null;
        this._scrollMetric = null;
        this._boundEventListener = null;
      } // Private

    }, {
      key: "_onTargetScroll",
      value: function _onTargetScroll(event) {
        var lastMetric = this._scrollMetric;
        this._scrollMetric = Monitor._resolveMetric(this._target);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Resolvers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var resolver = _step.value;
            var resolvedEvent = resolver.resolve(lastMetric, this._scrollMetric, event);

            if (resolvedEvent && resolvedEvent instanceof Event) {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = this._subscribers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var subscriber = _step2.value;
                  subscriber.dispatchEvent(resolvedEvent);
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }], [{
      key: "of",

      /**
       * Get the Monitor of the target.
       * If the Monitor of the target exists, then return it.
       * Otherwise, create a new Monitor for the target and return.
       * @param target target of the monitor
       * @throws when target is not valid
       * @return {Monitor}
       */
      value: function of(target) {
        Monitor._checkTarget(target);

        if (MonitorMap.has(target)) {
          return MonitorMap.get(target);
        } else {
          return new Monitor(target);
        }
      }
      /**
       * Register a new Resolver
       * @param resolver should be an instance of {@link Resolver}
       * @throws when resolver is not valid
       */

    }, {
      key: "registerResolver",
      value: function registerResolver(resolver) {
        this._checkResolver(resolver);

        Resolvers.add(resolver);
      }
      /**
       * Unregister a resolver
       * @param resolver the resolver should be unregistered
       */

    }, {
      key: "unregisterResolver",
      value: function unregisterResolver(resolver) {
        Resolvers.delete(resolver);
      }
      /**
       * Destroy all managed Monitors and unregister all Resolvers
       */

    }, {
      key: "reset",
      value: function reset() {
        MonitorMap.forEach(function (monitor) {
          return monitor.destroy();
        });
        Resolvers.clear();
      }
      /**
       * Create monitors and add subscribers to monitors by data attributes.
       * This function can be invoked repeatedly safely, subscribers will not be registered repeatedly.
       */

    }, {
      key: "_initByData",
      value: function _initByData() {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = document.querySelectorAll(Selectors.SCROLL_MONITOR)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var subscriber = _step3.value;
            var targetData = subscriber.dataset[Data.MONITOR_TARGET];

            if (targetData) {
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = document.querySelectorAll(targetData)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var target = _step4.value;
                  Monitor.of(target).subscribe(subscriber);
                }
              } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                    _iterator4.return();
                  }
                } finally {
                  if (_didIteratorError4) {
                    throw _iteratorError4;
                  }
                }
              }
            } else {
              Monitor.of(window).subscribe(subscriber);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }, {
      key: "_resolveMetric",
      value: function _resolveMetric(target) {
        var metric;

        if (target instanceof Window) {
          metric = new ScrollMetric(target.innerHeight, target.innerWidth, target.pageYOffset, target.pageXOffset);
        } else if (target instanceof Element) {
          metric = new ScrollMetric(target.scrollHeight, target.scrollWidth, target.scrollTop, target.scrollLeft);
        } else {
          throw new Error('Can not resolve ScrollMetric');
        }

        return metric;
      }
    }, {
      key: "_checkTarget",
      value: function _checkTarget(target) {
        for (var _i = 0; _i < ValidTargetTypes.length; _i++) {
          var type = ValidTargetTypes[_i];

          if (target instanceof type) {
            return;
          }
        }

        throw new Error("The target must be an instance of one in ".concat(ValidTargetTypes.map(function (type) {
          return type.name;
        }).join(', '), "!"));
      }
    }, {
      key: "_checkSubscriber",
      value: function _checkSubscriber(subscriber) {
        var requiredFunctions = ['addEventListener', 'removeEventListener', 'dispatchEvent'];

        if (!requiredFunctions.every(function (requiredFunc) {
          return subscriber[requiredFunc] instanceof Function;
        })) {
          throw new Error("The subscriber must have functions ".concat(requiredFunctions, "!"));
        }
      }
    }, {
      key: "_checkResolver",
      value: function _checkResolver(eventResolver) {
        if (!(eventResolver instanceof Resolver)) {
          throw new Error('The resolver must be an instance of Resolver!');
        }
      }
    }, {
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
      /**
       * Return the copy of the monitor map whose keys are targets and values are monitors
       * @return {Map<Window | Element, Monitor>}
       */

    }, {
      key: "monitorMap",
      get: function get() {
        return new Map(MonitorMap);
      }
      /**
       * Return the copy of a Set contains all registered resolvers
       * @return {Set<Resolver>}
       */

    }, {
      key: "resolvers",
      get: function get() {
        return new Set(Resolvers);
      }
    }]);

    return Monitor;
  }();

  var ScrollMetric =
  /*#__PURE__*/
  function () {
    function ScrollMetric(height, width, top, left) {
      _classCallCheck(this, ScrollMetric);

      this._height = height;
      this._width = width;
      this._top = top;
      this._left = left;
    } // Getter


    _createClass(ScrollMetric, [{
      key: "height",
      get: function get() {
        return this._height;
      }
    }, {
      key: "width",
      get: function get() {
        return this._width;
      }
    }, {
      key: "top",
      get: function get() {
        return this._top;
      }
    }, {
      key: "left",
      get: function get() {
        return this._left;
      }
    }]);

    return ScrollMetric;
  }();

  window.addEventListener(Events.DOM_CONTENT_LOADED, function () {
    Monitor._initByData();
  });
  return Monitor;
}();
//# sourceMappingURL=monitor.js.map