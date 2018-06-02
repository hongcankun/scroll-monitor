function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

/**
 * ----------------------------------------------------------------------------------
 * ScrollMonitor (v0.1.0): scroll-up.js
 * Licensed under MIT (https://github.com/swgrhck/scroll-monitor/blob/master/LICENSE)
 * ----------------------------------------------------------------------------------
 */
var ScrollUpResolver = function () {
  var VERSION = '0.1.0';
  var Selectors = {
    SCROLL_UP_MONITOR: '[data-monitor~="scroll-up"]'
  };
  var Data = {
    TOGGLE_CLASS: 'scrollUpClass'
  };
  var DataDefault = {
    TOGGLE_CLASS: 'scroll-up'
  };
  var Events = {
    SCROLL_UP: "scroll.up.".concat(Resolver.NAMESPACE),
    SCROLL_UP_OFF: "scroll.up.off.".concat(Resolver.NAMESPACE),
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  };

  var ScrollUpResolver =
  /*#__PURE__*/
  function (_Resolver) {
    function ScrollUpResolver() {
      _classCallCheck(this, ScrollUpResolver);

      return _possibleConstructorReturn(this, _getPrototypeOf(ScrollUpResolver).apply(this, arguments));
    }

    _createClass(ScrollUpResolver, [{
      key: "resolve",
      value: function resolve(lastMetric, crtMetric) {
        var lastTop = lastMetric.top;
        var crtTop = crtMetric.top;

        if (crtTop < lastTop) {
          return ScrollUpResolver._createEvent(Events.SCROLL_UP);
        } else {
          return ScrollUpResolver._createEvent(Events.SCROLL_UP_OFF);
        }
      }
    }, {
      key: "eventTypes",
      get: function get() {
        return [Events.SCROLL_UP, Events.SCROLL_UP_OFF];
      }
    }], [{
      key: "_createEvent",
      value: function _createEvent(type) {
        if (document.documentMode) {
          // if IE
          var event = document.createEvent('Event');
          event.initEvent(type, false, false);
          return event;
        } else {
          return new Event(type);
        }
      }
      /**
       * Add class toggle event listeners those respond to events of {@link ScrollUpResolver} to subscribers by data attributes.
       * This function can NOT be invoked repeatedly safely, event listeners will be registered repeatedly.
       */

    }, {
      key: "_initByData",
      value: function _initByData() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          var _loop = function _loop() {
            var subscriber = _step.value;
            var toggleClass = subscriber.dataset[Data.TOGGLE_CLASS] || DataDefault.TOGGLE_CLASS;
            subscriber.addEventListener(Events.SCROLL_UP, function () {
              subscriber.classList.add(toggleClass);
            });
            subscriber.addEventListener(Events.SCROLL_UP_OFF, function () {
              subscriber.classList.remove(toggleClass);
            });
          };

          for (var _iterator = document.querySelectorAll(Selectors.SCROLL_UP_MONITOR)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
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
    }, {
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    _inherits(ScrollUpResolver, _Resolver);

    return ScrollUpResolver;
  }(Resolver);

  window.addEventListener(Events.DOM_CONTENT_LOADED, function () {
    Monitor.registerResolver(new ScrollUpResolver());

    ScrollUpResolver._initByData();
  });
  return ScrollUpResolver;
}();
//# sourceMappingURL=scroll-up.js.map