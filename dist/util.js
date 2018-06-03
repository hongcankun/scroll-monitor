var Util = function () {
  var Util = {
    createEvent: function createEvent(type, options) {
      var defaultOptions = {
        bubbles: false,
        cancelable: false,
        composed: false
      };
      options = Object.assign(defaultOptions, options);

      if (document.documentMode) {
        // if IE
        var event = document.createEvent('Event');
        event.initEvent(type, options.bubbles, options.cancelable);
        return event;
      } else {
        return new Event(type, options);
      }
    }
  };
  return Util;
}();
//# sourceMappingURL=util.js.map