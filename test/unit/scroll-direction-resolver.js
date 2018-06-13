var ScrollDirectionResolver = window.ScrollDirectionResolver || window.scrollMonitor.ScrollDirectionResolver

describe('ScrollDirectionResolver', function () {
  it('should defind as a function', function () {
    expect(ScrollDirectionResolver).to.be.a('function')
  })

  describe('#interval', function () {
    it('should return default interval when undefined', function () {
      expect(new ScrollDirectionResolver()).to.have.property('interval', 50)
    })

    it('should return defined interval', function () {
      expect(new ScrollDirectionResolver(0)).to.have.property('interval', 0)
    })

    it('should change interval', function () {
      var resolver = new ScrollDirectionResolver()
      resolver.interval = 100
      expect(resolver.interval).to.equal(100)
    })
  })

  describe('#eventTypes', function () {
    it('should return an array contains defined event types', function () {
      expect(new ScrollDirectionResolver()).to.have.property('eventTypes').that.has.lengthOf(4)
    })
  })

  describe('static #_initByData', function () {
    it('should register listeners to do nothing when toggle classes data is not defined', function () {
      var subscriber = document.createElement('p')
      subscriber.dataset['monitor'] = 'scroll-direction and something else'
      document.body.appendChild(subscriber)

      ScrollDirectionResolver._initByData()

      subscriber.dispatchEvent(new Event('scroll.up.scroll-monitor'))
      expect(subscriber.classList).to.have.lengthOf(0)

      subscriber.dispatchEvent(new Event('scroll.down.scroll-monitor'))
      expect(subscriber.classList).to.have.lengthOf(0)

      subscriber.dispatchEvent(new Event('scroll.left.scroll-monitor'))
      expect(subscriber.classList).to.have.lengthOf(0)

      subscriber.dispatchEvent(new Event('scroll.right.scroll-monitor'))
      expect(subscriber.classList).to.have.lengthOf(0)
    })

    it('should register listener to subscribers to toggle defined classes as specified by data', function () {
      var subscriber = document.createElement('p')
      subscriber.dataset['monitor'] = 'scroll-direction and something else'
      subscriber.dataset['scrollUpClasses'] = 'up up2'
      subscriber.dataset['scrollDownClasses'] = '  down  '
      subscriber.dataset['scrollLeftClasses'] = '  left  left2  '
      subscriber.dataset['scrollRightClasses'] = 'right'
      document.body.appendChild(subscriber)

      ScrollDirectionResolver._initByData()

      subscriber.dispatchEvent(new Event('scroll.up.scroll-monitor'))
      expect(subscriber.classList.contains('up')).to.be.true
      expect(subscriber.classList.contains('up2')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.down.scroll-monitor'))
      expect(subscriber.classList.contains('down')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.left.scroll-monitor'))
      expect(subscriber.classList.contains('left')).to.be.true
      expect(subscriber.classList.contains('left2')).to.be.true

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

      resolver = new ScrollDirectionResolver()
      events = resolver.resolve(crtMetric, lastMetric)
      expect(events).to.be.an.instanceof(Array).that.has.lengthOf(2)
      expect(events[0]).to.be.an.instanceof(Event).that.has.property('type', 'scroll.down.scroll-monitor')
      expect(events[1]).to.be.an.instanceof(Event).that.has.property('type', 'scroll.left.scroll-monitor')
    })

    it('should not resolve events if subsequent invocations are within time interval', function () {
      var resolver = new ScrollDirectionResolver(1000)
      var m1 = {top: 100, left: 0}, m2 = {top: 0, left: 100}
      expect(resolver.resolve(m1, m2)).to.have.lengthOf.above(0)
      expect(resolver.resolve(m1, m2)).to.have.lengthOf(0)
    })

    it('should resolve events if exceeds the time interval', function (done) {
      var resolver = new ScrollDirectionResolver()
      var m1 = {top: 100, left: 0}, m2 = {top: 0, left: 100}
      expect(resolver.resolve(m1, m2)).to.have.lengthOf.above(0)
      expect(resolver.resolve(m1, m2)).to.have.lengthOf(0)
      setTimeout(function () {
        expect(resolver.resolve(m1, m2)).to.have.lengthOf.above(0)
        done()
      }, 50)
    })
  })
})
