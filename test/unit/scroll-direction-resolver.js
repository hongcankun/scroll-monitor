var Monitor = window.Monitor || window.scrollMonitor.Monitor
var ScrollDirectionResolver = window.ScrollDirectionResolver || window.scrollMonitor.ScrollDirectionResolver

describe('ScrollDirectionResolver', function () {
  it('should define ScrollDirectionResolver as a function', function () {
    expect(ScrollDirectionResolver).to.be.a('function')
  })

  describe('@constructor', function () {
    it('should create a ScrollDirectionResolver as expected', function () {
      var resolver = new ScrollDirectionResolver(window)
      expect(resolver).to.have.property('subscriber', window)
      expect(resolver._ticker).to.have.property('interval', 50)

      resolver = new ScrollDirectionResolver(document.body, 100)
      expect(resolver).to.have.property('subscriber', document.body)
      expect(resolver._ticker).to.have.property('interval', 100)
    })

    it('should throw error when the given subscriber is invalid', function () {
      expect(function () {
        new ScrollDirectionResolver({})
      }).to.throw()
    })
  })

  describe('$subscriber', function () {
    it('should return the subscriber of the resolver', function () {
      var resolver = new ScrollDirectionResolver(window)
      expect(resolver.subscriber).to.be.equal(window)
    })

    it('should set the subscriber of the resolver as expected', function () {
      var resolver = new ScrollDirectionResolver(window)
      resolver.subscriber = document.body
      expect(resolver.subscriber).to.be.equal(document.body)
    })

    it('should throw error when set a invalid subscribe to the resolver', function () {
      expect(function () {
        var resolver = new ScrollDirectionResolver(window)
        resolver.subscriber = {}
      }).to.throw()
    })
  })

  describe('@_initByData', function () {
    var subscriber

    beforeEach('clear monitors', function () {
      Monitor.clear()
      subscriber = document.createElement('p')
      subscriber.dataset['monitor'] = 'scroll-direction and something else'
      document.body.appendChild(subscriber)
    })

    it('should add resolvers to monitors of specified targets', function () {
      subscriber.dataset['target'] = 'body'
      ScrollDirectionResolver._initByData()

      var monitor = Monitor.of(document.body)
      expect(monitor.resolvers).to.not.be.empty
      monitor.resolvers.forEach(function (resolver) {
        expect(resolver.subscriber).to.be.equal(subscriber)
      })
    })

    it('should register listeners to do nothing when toggle classes data is not defined', function () {
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
      subscriber.dataset['scrollUp'] = 'up up2'
      subscriber.dataset['scrollDown'] = '  down  '
      subscriber.dataset['scrollLeft'] = '  left  left2  '
      subscriber.dataset['scrollRight'] = 'right'

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
    var scrollUp = false, scrollDown = false

    before('add event listener to window', function () {
      window.addEventListener('scroll.up.scroll-monitor', function () {
        scrollUp = true
      })
      window.addEventListener('scroll.down.scroll-monitor', function () {
        scrollDown = true
      })
    })

    beforeEach('reset scroll states', function () {
      scrollUp = false
      scrollDown = false
    })

    it('should dispatch proper events to subscriber', function () {
      var resolver = new ScrollDirectionResolver(window)
      var lastMetric = {top: 100, left: 0}, crtMetric = {top: 0, left: 100}

      resolver.resolve(lastMetric, crtMetric)
      expect(scrollUp).to.be.true
      expect(scrollDown).to.be.false

      resolver = new ScrollDirectionResolver(window)
      resolver.resolve(crtMetric, lastMetric)
      expect(scrollDown).to.be.true
    })

    it('should not resolve events if subsequent invocations are within time interval', function () {
      var resolver = new ScrollDirectionResolver(window, 1000)
      var m1 = {top: 100, left: 0}, m2 = {top: 0, left: 100}

      resolver.resolve(m1, m2)
      expect(scrollUp).to.be.true
      expect(scrollDown).to.be.false

      resolver.resolve(m2, m1)
      expect(scrollDown).to.be.false
    })

    it('should resolve events if exceeds the time interval', function (done) {
      var resolver = new ScrollDirectionResolver(window)
      var m1 = {top: 100, left: 0}, m2 = {top: 0, left: 100}

      resolver.resolve(m1, m2)
      expect(scrollUp).to.be.true
      expect(scrollDown).to.be.false

      resolver.resolve(m2, m1)
      expect(scrollDown).to.be.false

      setTimeout(function () {
        resolver.resolve(m2, m1)
        expect(scrollDown).to.be.true
        done()
      }, 50)
    })
  })
})
