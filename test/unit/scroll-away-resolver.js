describe('ScrollAwayResolver', function () {
  var Monitor = window.Monitor || window.scrollMonitor.Monitor
  var Resolver = window.ScrollAwayResolver || window.scrollMonitor.ScrollAwayResolver

  describe('@constructor', function () {

    it('should create a resolver with default interval and options when they are not specified', function () {
      var resolver = new Resolver(window)
      expect(resolver._ticker).to.have.property('interval', 50)
      expect(resolver).to.have.property('_options').that.is.eql({top: 100, bottom: 100, left: 100, right: 100})
    })

    it('should create a resolver with given interval', function () {
      var interval = 20
      expect(new Resolver(window, interval)._ticker).to.have.property('interval', interval)
    })

    it('should create a resolver with given options', function () {
      var options = {top: 10, bottom: 20, right: 40}
      expect(new Resolver(window, null, options)).to.have.property('_options')
        .that.is.eql({top: 10, bottom: 20, left: 100, right: 40})
    })

  })

  describe('@_initByData', function () {
    var subscriber

    beforeEach('init subscriber and clear monitors', function () {
      Monitor.clear()
      subscriber !== undefined && document.body.removeChild(subscriber)
      subscriber = document.createElement('p')
      subscriber.dataset['monitor'] = 'scroll-away and something else'
      document.body.appendChild(subscriber)
    })

    it('should register a resolver to corresponding monitor with default options', function () {
      Resolver._initByData()

      expect(Monitor.monitors).to.include.key(window)
      var monitor = Monitor.of(window)
      expect(monitor.resolvers).to.have.property('size', 1)
      monitor.resolvers.forEach(function (resolver) {
        expect(resolver._ticker).to.have.property('interval', 50)
        expect(resolver).to.have.property('_options').that.is.eql({top: 100, bottom: 100, left: 100, right: 100})
        expect(resolver).to.have.property('subscriber', subscriber)
      })
    })

    it('should register a resolver to corresponding monitor with given options', function () {
      subscriber.dataset['target'] = 'body'
      subscriber.dataset['interval'] = '10'
      subscriber.dataset['distanceTop'] = '10'
      subscriber.dataset['distanceBottom'] = '20'
      Resolver._initByData()

      expect(Monitor.monitors).to.include.key(document.body)
      var monitor = Monitor.of(document.body)
      expect(monitor.resolvers).to.have.property('size', 1)
      monitor.resolvers.forEach(function (resolver) {
        expect(resolver._ticker).to.have.property('interval', 10)
        expect(resolver).to.have.property('_options').that.is.eql({top: 10, bottom: 20, left: 100, right: 100})
        expect(resolver).to.have.property('subscriber', subscriber)
      })
    })

    it('should add event listeners that would do nothing to subscriber when toggle classes is not supplied', function () {
      Resolver._initByData()

      var events = [
        'scroll.away.top.scroll-monitor',
        'scroll.away.top.off.scroll-monitor',
        'scroll.away.bottom.scroll-monitor',
        'scroll.away.bottom.off.scroll-monitor',
        'scroll.away.left.scroll-monitor',
        'scroll.away.left.off.scroll-monitor',
        'scroll.away.right.scroll-monitor',
        'scroll.away.right.off.scroll-monitor'
      ]
      events.forEach(function (event) {
        subscriber.dispatchEvent(new Event(event))
        expect(subscriber.classList).to.have.a.lengthOf(0)
      })
    })

    it('should add event listeners that would trigger classes when toggle classes is supplied', function () {
      subscriber.dataset['awayTop'] = 'away-top'
      subscriber.dataset['awayRight'] = 'away-right'

      Resolver._initByData()

      subscriber.dispatchEvent(new Event('scroll.away.top.scroll-monitor'))
      expect(subscriber.classList.contains('away-top')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.away.right.scroll-monitor'))
      expect(subscriber.classList.contains('away-top')).to.be.true
      expect(subscriber.classList.contains('away-right')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.away.top.off.scroll-monitor'))
      expect(subscriber.classList.contains('away-top')).to.be.false
      expect(subscriber.classList.contains('away-right')).to.be.true

      subscriber.dispatchEvent(new Event('scroll.away.right.off.scroll-monitor'))
      expect(subscriber.classList.contains('away-top')).to.be.false
      expect(subscriber.classList.contains('away-right')).to.be.false
    })

  })

  describe('#_doResolve', function () {

    it('should push proper events as expected', function () {
      var resolver = new Resolver(window)

      var events = []
      var lastMetric = {top: 100, bottom: 100, left: 100, right: 100}
      var crtMetric = {top: 150, bottom: 50, left: 150, right: 50}
      resolver._doResolve(events, lastMetric, crtMetric)
      expect(events).to.have.lengthOf(4)
      expect(events[0]).to.have.property('type', 'scroll.away.top.scroll-monitor')
      expect(events[1]).to.have.property('type', 'scroll.away.bottom.off.scroll-monitor')
      expect(events[2]).to.have.property('type', 'scroll.away.left.scroll-monitor')
      expect(events[3]).to.have.property('type', 'scroll.away.right.off.scroll-monitor')

      events = []
      crtMetric = {top: 50, bottom: 150, left: 50, right: 150}
      resolver._doResolve(events, lastMetric, crtMetric)
      expect(events).to.have.lengthOf(4)
      expect(events[0]).to.have.property('type', 'scroll.away.top.off.scroll-monitor')
      expect(events[1]).to.have.property('type', 'scroll.away.bottom.scroll-monitor')
      expect(events[2]).to.have.property('type', 'scroll.away.left.off.scroll-monitor')
      expect(events[3]).to.have.property('type', 'scroll.away.right.scroll-monitor')

      events = []
      crtMetric = {top: 150, bottom: 50, left: 100, right: 100}
      resolver._doResolve(events, lastMetric, crtMetric)
      expect(events).to.have.lengthOf(2)
      expect(events[0]).to.have.property('type', 'scroll.away.top.scroll-monitor')
      expect(events[1]).to.have.property('type', 'scroll.away.bottom.off.scroll-monitor')

      events = []
      crtMetric = {top: 100, bottom: 100, left: 150, right: 50}
      resolver._doResolve(events, lastMetric, crtMetric)
      expect(events).to.have.lengthOf(2)
      expect(events[0]).to.have.property('type', 'scroll.away.left.scroll-monitor')
      expect(events[1]).to.have.property('type', 'scroll.away.right.off.scroll-monitor')
    })

  })

})
