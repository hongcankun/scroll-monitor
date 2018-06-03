var Util = window.Util || window.scrollMonitor.Util
var ScrollUp = window.ScrollUpResolver || window.scrollMonitor.ScrollUp

describe('ScrollUp', function () {
  it('should defind as a function', function () {
    expect(ScrollUp).to.be.a('function')
  })

  describe('static #VERSION', function () {
    it('should return version as string', function () {
      expect(ScrollUp).to.have.property('VERSION').that.is.a('string')
    })
  })

  describe('#eventTypes', function () {
    it('should return an array contains defined event types', function () {
      expect(new ScrollUp()).to.have.property('eventTypes').that.has.lengthOf(2)
    })
  })

  describe('static #_initByData', function () {
    it('should register listeners to subscribers to toggle class scroll-up when toggle class data is not defined', function () {
      var subscriber = document.createElement('p')
      subscriber.dataset['monitor'] = 'scroll-up and something else'
      document.body.appendChild(subscriber)

      ScrollUp._initByData()

      subscriber.dispatchEvent(Util.createEvent('scroll.up.scroll-monitor'))
      expect(subscriber.classList.contains('scroll-up')).to.be.true

      subscriber.dispatchEvent(Util.createEvent('scroll.up.off.scroll-monitor'))
      expect(subscriber.classList.contains('scroll-up')).to.be.false
    })

    it('should register listener to subscribers to toggle defined class as specified by data', function () {
      var subscriber = document.createElement('p')
      subscriber.dataset['monitor'] = 'scroll-up and something else'
      subscriber.dataset['scrollUpClass'] = 'active'
      document.body.appendChild(subscriber)

      ScrollUp._initByData()

      subscriber.dispatchEvent(Util.createEvent('scroll.up.scroll-monitor'))
      expect(subscriber.classList.contains('active')).to.be.true

      subscriber.dispatchEvent(Util.createEvent('scroll.up.off.scroll-monitor'))
      expect(subscriber.classList.contains('active')).to.be.false
    })
  })

  describe('#resolve', function () {
    it('should return event SCROLL_UP when scroll up', function () {
      var scrollUp = new ScrollUp()
      var lastMetric = {top: 100}, crtMetric = {top: 0}
      expect(scrollUp.resolve(lastMetric, crtMetric)).to.be.an.instanceof(Event)
        .and.have.property('type', 'scroll.up.scroll-monitor')

      expect(scrollUp.resolve(crtMetric, lastMetric)).to.be.an.instanceof(Event)
        .and.have.property('type', 'scroll.up.off.scroll-monitor')
    })
  })
})
