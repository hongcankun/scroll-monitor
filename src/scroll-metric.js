const ScrollMetric = (() => {

  const VERSION = '0.1.0'

  class ScrollMetric {
    constructor(height, width, top, left) {
      this._height = height
      this._width = width
      this._top = top
      this._left = left
    }

    // Getter
    //

    static get VERSION() {
      return VERSION
    }

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

  return ScrollMetric
})()

export default ScrollMetric
