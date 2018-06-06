var ScrollDirectionResolver = window.ScrollDirectionResolver || window.scrollMonitor.ScrollDirectionResolver

describe('ScrollDirectionResolver', function () {
  it('should defind as a function', function () {
    expect(ScrollDirectionResolver).to.be.a('function')
  })

  describe('static #VERSION', function () {
    it('should return version as string', function () {
      expect(ScrollDirectionResolver).to.have.property('VERSION').that.is.a('string')
    })
  })

  describe('#eventTypes', function () {
    it('should return an array contains defined event types', function () {
      expect(new ScrollDirectionResolver()).to.have.property('eventTypes').that.has.lengthOf(4)
    })
  })

  describe('static #_initByData', function () {
    it('should register listeners to subscribers to toggle default classes when toggle classes data is not defined', function () {
      var subscriber = document.createElement('p')
      subscriber.dataset['monitor'] = 'scroll-direction and something else'
      document.body.appendChild(subscriber)

      ScrollDirectionResolver._initByData()

      subscriber.dispatchEvent(new Event('scroll.up.scroll-monitor'))
      expect(subscriber.classList.contains('scroll-up')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.down.scroll-monitor'))
      expect(subscriber.classList.contains('scroll-down')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.left.scroll-monitor'))
      expect(subscriber.classList.contains('scroll-left')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.right.scroll-monitor'))
      expect(subscriber.classList.contains('scroll-right')).to.be.true
    })

    it('should register listener to subscribers to toggle defined classes as specified by data', function () {
      var subscriber = document.createElement('p')
      subscriber.dataset['monitor'] = 'scroll-direction and something else'
      subscriber.dataset['scrollUpClass'] = 'up'
      subscriber.dataset['scrollDownClass'] = 'down'
      subscriber.dataset['scrollLeftClass'] = 'left'
      subscriber.dataset['scrollRightClass'] = 'right'
      document.body.appendChild(subscriber)

      ScrollDirectionResolver._initByData()

      subscriber.dispatchEvent(new Event('scroll.up.scroll-monitor'))
      expect(subscriber.classList.contains('up')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.down.scroll-monitor'))
      expect(subscriber.classList.contains('down')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.left.scroll-monitor'))
      expect(subscriber.classList.contains('left')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.right.scroll-monitor'))
      expect(subscriber.classList.contains('right')).to.be.true
    })
  })

  describe('#resolve', function () {
    it('should return proper events array', function () {
      var resolver = new ScrollDirectionResolver()
      var lastMetric = {top: 100, left: 0}, crtMetric = {top: 0, left: 100}

      var events = resolver.resolve(lastMetric, crtMetric)
      expect(events).to.be.an.instanceof(Array).that.has.lengthOf(2)
      expect(events[0]).to.be.an.instanceof(Event).that.has.property('type', 'scroll.up.scroll-monitor')
      expect(events[1]).to.be.an.instanceof(Event).that.has.property('type', 'scroll.right.scroll-monitor')

      events = resolver.resolve(crtMetric, lastMetric)
      expect(events).to.be.an.instanceof(Array).that.has.lengthOf(2)
      expect(events[0]).to.be.an.instanceof(Event).that.has.property('type', 'scroll.down.scroll-monitor')
      expect(events[1]).to.be.an.instanceof(Event).that.has.property('type', 'scroll.left.scroll-monitor')
    })
  })
})
