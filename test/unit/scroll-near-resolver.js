var Monitor = window.Monitor || window.scrollMonitor.Monitor
var Resolver = window.ScrollNearResolver || window.scrollMonitor.ScrollNearResolver

describe('ScrollNearResolver', function () {
  describe('@constructor', function () {
    it('should create a resolve using default interval and options when not supplied', function () {
      var resolver = new Resolver(window)
      expect(resolver._ticker).to.have.property('interval', 50)
      expect(resolver).to.have.property('_options').that.eql({top: 100, bottom: 100, left: 100, right: 100})
    })

    it('should create a resolver with specified interval and options', function () {
      var resolver = new Resolver(window, 100, {top: 50, left: 20})
      expect(resolver._ticker).to.have.property('interval', 100)
      expect(resolver).to.have.property('_options').that.eql({top: 50, left: 20, bottom: 100, right: 100})
    })
  })

  describe('@_initByData', function () {
    var subscriber

    beforeEach('clear monitors', function () {
      Monitor.clear()
      subscriber !== undefined && document.body.removeChild(subscriber)
      subscriber = document.createElement('p')
      subscriber.dataset['monitor'] = 'scroll-near and something else'
      document.body.appendChild(subscriber)
    })

    it('should add resolvers to monitors of specified targets', function () {
      subscriber.dataset['target'] = 'body'
      Resolver._initByData()

      var monitor = Monitor.of(document.body)
      expect(monitor.resolvers).to.not.be.empty
      monitor.resolvers.forEach(function (resolver) {
        expect(resolver.subscriber).to.be.equal(subscriber)
      })
    })

    it('should register listeners to do nothing when toggle classes data is not defined', function () {
      Resolver._initByData()

      subscriber.dispatchEvent(new Event('scroll.near.top.scroll-monitor'))
      expect(subscriber.classList).to.have.lengthOf(0)

      subscriber.dispatchEvent(new Event('scroll.near.bottom.scroll-monitor'))
      expect(subscriber.classList).to.have.lengthOf(0)

      subscriber.dispatchEvent(new Event('scroll.near.left.scroll-monitor'))
      expect(subscriber.classList).to.have.lengthOf(0)

      subscriber.dispatchEvent(new Event('scroll.near.right.scroll-monitor'))
      expect(subscriber.classList).to.have.lengthOf(0)
    })

    it('should register listeners to subscribers to toggle defined classes as specified by data', function () {
      subscriber.dataset['nearTop'] = 'top top2'
      subscriber.dataset['nearBottom'] = '  bottom  '
      subscriber.dataset['nearLeft'] = '  left  left2  '
      subscriber.dataset['nearRight'] = 'right'

      Resolver._initByData()

      subscriber.dispatchEvent(new Event('scroll.near.top.scroll-monitor'))
      expect(subscriber.classList.contains('top')).to.be.true
      expect(subscriber.classList.contains('top2')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.near.bottom.scroll-monitor'))
      expect(subscriber.classList.contains('bottom')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.near.left.scroll-monitor'))
      expect(subscriber.classList.contains('left')).to.be.true
      expect(subscriber.classList.contains('left2')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.near.right.scroll-monitor'))
      expect(subscriber.classList.contains('right')).to.be.true
    })

    it('should add resolvers with specified distance options to monitors', function () {
      subscriber.dataset['distanceTop'] = '10'
      subscriber.dataset['distanceBottom'] = '20'
      subscriber.dataset['distanceLeft'] = '30'

      Resolver._initByData()
      var monitor = Monitor.of(window)
      monitor.resolvers.forEach(function (resolver) {
        expect(resolver._options).to.deep.equal({top: 10, bottom: 20, left: 30, right: 100})
      })
    })
  })

  describe('#_doResolve', function () {
    it('should resolve scroll events as expected', function () {
      var events = []
      var resolver = new Resolver(window, undefined)
      var crtMetric = {top: 100, left: 100, bottom: 100, right: 100}
      var lastMetric = {top: 150, left: 150, bottom: 50, right: 50}
      resolver._doResolve(events, lastMetric, crtMetric)
      expect(events[0]).to.have.property('type', 'scroll.near.top.scroll-monitor')
      expect(events[1]).to.have.property('type', 'scroll.near.left.scroll-monitor')

      events = []
      lastMetric = {top: 50, left: 50, bottom: 150, right: 150}
      resolver._doResolve(events, lastMetric, crtMetric)
      expect(events[0]).to.have.property('type', 'scroll.near.bottom.scroll-monitor')
      expect(events[1]).to.have.property('type', 'scroll.near.right.scroll-monitor')
    })
  })
})
