var Util = window.Util || window.scrollMonitor.Util
var Resolver = window.Resolver || window.scrollMonitor.Resolver
var Monitor = window.Monitor || window.scrollMonitor.Monitor

describe('Monitor', function () {
  beforeEach('reset Monitor', function () {
    Monitor.reset()
  })

  it('should Monitor defined properly', function () {
    expect(Monitor).to.be.a('function')
  })

  describe('static #VERSION', function () {
    it('should return as a string', function () {
      expect(Monitor).to.have.property('VERSION').that.is.a('string')
    })
  })

  describe('static #monitorMap', function () {
    it('should return an empty map it there is no monitor registered', function () {
      expect(Monitor.monitorMap).to.be.empty
    })

    it('should return a copy of the monitorMap contains all', function () {
      var target1 = window
      Monitor.of(target1)
      expect(Monitor.monitorMap).to.have.key(target1).and.have.property('size', 1)

      var target2 = document.body
      Monitor.of(target2)
      expect(Monitor.monitorMap).to.have.all.keys(target1, target2).and.have.property('size', 2)
    })

    it('should return a copy that will not influence origin map', function () {
      Monitor.of(window)
      expect(Monitor.monitorMap).to.have.key(window)

      var copy = Monitor.monitorMap
      copy.clear()
      expect(copy).to.be.empty
      expect(Monitor.monitorMap).to.have.key(window)
    })
  })

  describe('static #resolvers', function () {
    it('should return an empty set it there is no resolver registered', function () {
      expect(Monitor.resolvers).to.be.empty
    })

    it('should return a copy of the resolvers contains all', function () {
      var resolver1 = new Resolver()
      Monitor.registerResolver(resolver1)
      expect(Monitor.resolvers).to.have.key(resolver1).and.have.property('size', 1)

      var resolver2 = new Resolver()
      Monitor.registerResolver(resolver2)
      expect(Monitor.resolvers).to.have.all.keys(resolver1, resolver2).and.have.property('size', 2)
    })

    it('should return a copy that will not influence origin set', function () {
      var resolver = new Resolver()
      Monitor.registerResolver(resolver)
      expect(Monitor.resolvers).to.have.key(resolver)

      var copy = Monitor.resolvers
      copy.clear()
      expect(copy).to.be.empty
      expect(Monitor.resolvers).to.have.key(resolver)
    })
  })

  describe('static #of', function () {
    it('should throw error when target is not valid', function () {
      expect(function () {
        Monitor.of(Monitor)
      }).to.throw()
    })

    it('should create and return a new monitor when the monitor of the target does not exist', function () {
      var target = window
      expect(Monitor.monitorMap.get(target)).to.not.exist
      expect(Monitor.of(target)).to.exist.and.be.an.instanceof(Monitor)
      expect(Monitor.monitorMap.get(target)).to.exist.and.be.an.instanceof(Monitor)
    })

    it('should return same monitor when the monitor of the target has existed', function () {
      var target = window
      var monitor = new Monitor(target)
      expect(Monitor.monitorMap.get(target)).to.exist
      expect(Monitor.of(target)).to.be.equal(monitor)
      expect(Monitor.of(target)).to.be.equal(Monitor.of(target))
    })
  })

  describe('static #registerResolver', function () {
    it('should throw err when resolver is not an instance of Resolver', function () {
      expect(function () {
        Monitor.registerResolver(Monitor)
      }).to.throw()
    })

    it('should add resolver it the resolver has not been registered', function () {
      var resolver = new Resolver()
      expect(Monitor.resolvers.has(resolver)).to.be.false

      Monitor.registerResolver(resolver)
      expect(Monitor.resolvers.has(resolver)).to.be.true
    })

    it('should make no sense if the resolver has been registered', function () {
      var resolver = new Resolver()
      expect(Monitor.resolvers).to.be.empty
      expect(Monitor.resolvers.has(resolver)).to.be.false

      Monitor.registerResolver(resolver)
      expect(Monitor.resolvers).to.have.property('size', 1)
      expect(Monitor.resolvers.has(resolver)).to.be.true

      Monitor.registerResolver(resolver)
      expect(Monitor.resolvers).to.have.property('size', 1)
      expect(Monitor.resolvers.has(resolver)).to.be.true
    })
  })

  describe('static #unregisterResolver', function () {
    it('should remove resolver it exist', function () {
      var resolver = new Resolver()
      Monitor.registerResolver(resolver)
      expect(Monitor.resolvers).to.have.key(resolver)

      Monitor.unregisterResolver(resolver)
      expect(Monitor.resolvers).to.not.have.key(resolver)
    })
  })

  describe('#reset', function () {
    it('should reset all monitors and resolvers', function () {
      Monitor.of(window)
      Monitor.registerResolver(new Resolver())

      expect(Monitor.monitorMap).to.not.be.empty
      expect(Monitor.resolvers).to.not.be.empty
    })
  })

  describe('static #_initByData', function () {
    it('should create monitors and add subscribers to monitors by data attributes properly', function () {
      var div = document.createElement('div')
      div.dataset['monitor'] = 'scroll'
      div.classList.add('target')
      document.body.appendChild(div)

      var p = document.createElement('p')
      p.dataset['monitor'] = 'scroll'
      p.dataset['monitorTarget'] = '.target'
      div.appendChild(p)

      Monitor._initByData()
      expect(Monitor.monitorMap).to.have.all.keys(window, div)
      expect(Monitor.of(window)._subscribers).to.include(div)
      expect(Monitor.of(div)._subscribers).to.include(p)
    })
  })

  describe('static #_resolveMetric', function () {
    it('should throw err when target is not valid', function () {
      expect(function () {
        Monitor._resolveMetric(Monitor)
      }).to.throw()
    })

    it('should return a ScrollMetric when target is an instance of Window', function () {
      var scrollMetric = Monitor._resolveMetric(window)
      expect(scrollMetric).to.have.property('height').that.is.a('number')
      expect(scrollMetric).to.have.property('width').that.is.a('number')
      expect(scrollMetric).to.have.property('top').that.is.a('number')
      expect(scrollMetric).to.have.property('left').that.is.a('number')
    })

    it('should return a ScrollMetric when target is an instance of Element', function () {
      var scrollMetric = Monitor._resolveMetric(document.body)
      expect(scrollMetric).to.have.property('height').that.is.a('number')
      expect(scrollMetric).to.have.property('width').that.is.a('number')
      expect(scrollMetric).to.have.property('top').that.is.a('number')
      expect(scrollMetric).to.have.property('left').that.is.a('number')
    })
  })

  describe('static #_checkTarget', function () {
    it('should not throw error when target is an instance of Window or Element', function () {
      expect(function () {
        Monitor._checkTarget(window)
      }).to.not.throw()

      expect(function () {
        Monitor._checkTarget(document.body)
      }).to.not.throw()
    })

    it('should throw error when target is not valid', function () {
      expect(function () {
        Monitor._checkTarget(Monitor)
      }).to.throw()
    })
  })

  describe('static #_checkSubscriber', function () {
    it('should throw error when subscriber is not an instance of EventTarget', function () {
      expect(function () {
        Monitor._checkSubscriber(Monitor)
      }).to.throw()
    })

    it('should not throw error when subscriber is an instance of EventTarget', function () {
      expect(function () {
        Monitor._checkSubscriber(document.body)
      }).to.not.throw()
    })
  })

  describe('static #_checkResolver', function () {
    it('should throw error when resolver is not an instance of Resolver', function () {
      expect(function () {
        Monitor._checkResolver(Monitor)
      }).to.throw()
    })

    it('should not throw error when resolver is an instance of Resolver', function () {
      expect(function () {
        Monitor._checkResolver(new Resolver())
      }).to.not.throw()
    })
  })

  describe('#constructor', function () {
    it('should create a monitor properly', function () {
      var monitor = new Monitor(window)
      expect(monitor).to.be.an.instanceof(Monitor)
      expect(Monitor.monitorMap).to.include(monitor)

      monitor._scrollMetric._top = 100
      window.dispatchEvent(Util.createEvent('scroll'))
      expect(monitor._scrollMetric).to.have.property('top', 0)
    })

    it('should return a monitor of window when target is null', function () {
      expect(new Monitor()._target).to.be.equal(window)
    })

    it('should throw error when target is invalid', function () {
      expect(function () {
        new Monitor(Monitor)
      }).to.throw()
    })

    it('should destroy and then return a new monitor when the monitor of target exists', function () {
      var origin = new Monitor(window)
      expect(Monitor.monitorMap.has(window)).to.be.true
      expect(Monitor.of(window)).to.be.equal(origin)
      var after = new Monitor(window)
      expect(Monitor.of(window)).to.be.equal(after).and.not.be.equal(origin)
    })
  })

  describe('#subscribe', function () {
    it('should throw error when subscriber is not valid', function () {
      expect(function () {
        Monitor.of(window).subscribe(Monitor)
      }).to.throw()
    })

    it('should add a subscriber when subscriber is valid', function () {
      var subscriber = document.body
      var monitor = Monitor.of(window)
      monitor.subscribe(subscriber)
      expect(monitor._subscribers).to.include(subscriber).and.have.property('size', 1)
    })

    it('should make no sense when the subscriber to be add has been registered', function () {
      var subscriber = document.body
      var monitor = Monitor.of(window)
      monitor.subscribe(subscriber)
      expect(monitor._subscribers).to.include(subscriber).and.have.property('size', 1)

      monitor.subscribe(subscriber)
      expect(monitor._subscribers).to.include(subscriber).and.have.property('size', 1)
    })
  })

  describe('#unsubscribe', function () {
    it('should remove a subscriber when it exist', function () {
      var subscriber = document.body
      var monitor = Monitor.of(window)
      monitor.subscribe(subscriber)
      monitor.unsubscribe(subscriber)
      expect(monitor._subscribers).to.be.empty
    })

    it('should make no sense when the subscriber not exist', function () {
      var monitor = Monitor.of(window)
      monitor.subscribe(document.body)

      var subscriberToBeDeleted = window
      monitor.unsubscribe(subscriberToBeDeleted)
      expect(monitor._subscribers).to.not.be.empty
    })
  })

  describe('#destroy', function () {
    it('should destroy the monitor properly', function () {
      var monitor = Monitor.of(window)
      monitor.destroy()

      expect(Monitor.monitorMap).to.not.include(monitor)
      expect(monitor).to.have.property('_target').that.is.null
      expect(monitor).to.have.property('_subscribers').that.is.null
      expect(monitor).to.have.property('_scrollMetric').that.is.null
      expect(monitor).to.have.property('_boundEventListener').that.is.null

      window.dispatchEvent(Util.createEvent('scroll'))
      expect(monitor).to.have.property('_scrollMetric').that.is.null
    })
  })

  describe('#_onTargetScroll', function () {
    it('should trigger this method to update scrollMetric and dispatch resolvedEvent to subscribers when target receive a scroll event', function () {
      var resolver = new Resolver()
      resolver.count = 0
      resolver.resolve = function () {
        this.count++
        return this.count % 2 === 0 ? Util.createEvent('test') : null
      }

      var subscriber = document.body
      subscriber.count = 0
      subscriber.addEventListener('test', function () {
        this.count++
      })

      Monitor.registerResolver(resolver)

      var monitor = Monitor.of(window)
      monitor.subscribe(subscriber)
      monitor._scrollMetric._top = 100

      window.dispatchEvent(Util.createEvent('scroll'))
      window.dispatchEvent(Util.createEvent('scroll'))
      expect(monitor).to.have.property('_scrollMetric').that.has.property('top', 0)
      expect(resolver).to.have.property('count', 2)
      expect(subscriber).to.have.property('count', 1)
    })
  })
})
