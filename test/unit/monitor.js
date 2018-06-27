var Monitor = window.Monitor || window.scrollMonitor.Monitor

describe('Monitor', function () {

  function Resolver() {
    this.resolve = function () {
    }
  }

  beforeEach('reset Monitor', function () {
    Monitor.reset()
  })

  it('should Monitor defined properly', function () {
    expect(Monitor).to.be.a('function')
  })

  describe('static #NAMESPACE', function () {
    it('should return as a string', function () {
      expect(Monitor).to.have.property('NAMESPACE').that.is.a('string')
    })
  })

  describe('static #monitorMap', function () {
    it('should return an empty map if there has no monitor registered', function () {
      expect(Monitor.monitorMap).to.be.empty
    })

    it('should return a copy of the monitorMap contains all Monitors', function () {
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

  describe('#reset', function () {
    it('should reset all monitors', function () {
      Monitor.of(window)

      expect(Monitor.monitorMap).to.not.be.empty
    })
  })

  describe('static #_resolveMetric', function () {
    it('should throw error when target is not valid', function () {
      expect(function () {
        Monitor._resolveMetric(Monitor)
      }).to.throw()
    })

    it('should return a ScrollMetric when target is an instance of Window', function () {
      var scrollMetric = Monitor._resolveMetric(window)
      expect(scrollMetric).to.have.property('scrollHeight').that.is.a('number')
      expect(scrollMetric).to.have.property('scrollWidth').that.is.a('number')
      expect(scrollMetric).to.have.property('viewHeight').that.is.a('number')
      expect(scrollMetric).to.have.property('viewWidth').that.is.a('number')
      expect(scrollMetric).to.have.property('top').that.is.a('number')
      expect(scrollMetric).to.have.property('left').that.is.a('number')
    })

    it('should return a ScrollMetric when target is an instance of Element', function () {
      var scrollMetric = Monitor._resolveMetric(document.body)
      expect(scrollMetric).to.have.property('scrollHeight').that.is.a('number')
      expect(scrollMetric).to.have.property('scrollWidth').that.is.a('number')
      expect(scrollMetric).to.have.property('viewHeight').that.is.a('number')
      expect(scrollMetric).to.have.property('viewWidth').that.is.a('number')
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
      window.dispatchEvent(new Event('scroll'))
      expect(monitor._scrollMetric).to.have.property('top', 0)
    })

    it('should return a monitor of window when target is undefined', function () {
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

  describe('#target', function () {
    it('should return the target of the monitor which is read-only', function () {
      var monitor = Monitor.of(window)
      expect(monitor.target).to.be.equal(window)

      monitor.target = null
      expect(monitor.target).to.be.equal(window)
    })
  })

  describe('#resolvers', function () {
    it('should a copy of Monitor\'s own resolvers', function () {
      var monitor = Monitor.of(window)
      expect(monitor.resolvers).to.be.empty

      var resolver = new Resolver()
      monitor.registerResolver(resolver)
      expect(monitor.resolvers).to.have.key(resolver)

      monitor.resolvers.delete(resolver)
      expect(monitor.resolvers).to.have.key(resolver)
    })
  })

  describe('#registerResolver', function () {
    it('should register resolver successfully when resolver is valid', function () {
      var resolver = new Resolver()
      var monitor = Monitor.of(window)
      monitor.registerResolver(resolver)
      expect(monitor.resolvers).to.have.key(resolver)
    })

    it('should throw error when resolver is invalid', function () {
      expect(function () {
        Monitor.of(window).registerResolver(Monitor)
      }).to.throw
    })
  })

  describe('#unregisterResolver', function () {
    it('should unregister resolver properly', function () {
      var resolver = new Resolver()
      var monitor = Monitor.of(window)

      monitor.registerResolver(resolver)
      expect(monitor.unregisterResolver(Monitor)).to.be.false
      expect(monitor.resolvers).to.have.key(resolver)

      expect(monitor.unregisterResolver(resolver)).to.be.true
      expect(monitor.resolvers).to.be.empty
    })
  })

  describe('#destroy', function () {
    it('should destroy the monitor properly', function () {
      var monitor = Monitor.of(window)
      monitor.destroy()

      expect(Monitor.monitorMap).to.not.include(monitor)
      expect(monitor).to.have.property('_target').that.is.null
      expect(monitor).to.have.property('_resolvers').that.is.null
      expect(monitor).to.have.property('_scrollMetric').that.is.null
      expect(monitor).to.have.property('_boundEventListener').that.is.null

      window.dispatchEvent(new Event('scroll'))
      expect(monitor).to.have.property('_scrollMetric').that.is.null
    })
  })

  describe('#_onTargetScroll', function () {
    it('should trigger this method to update scrollMetric and deliver metrics and origin event to resolvers', function () {
      var resolver1 = new Resolver()
      resolver1.invoked = false
      resolver1.resolve = function () {
        this.invoked = true
      }

      var resolver2 = new Resolver()
      resolver2.invoked = false
      resolver2.resolve = function () {
        this.invoked = true
      }

      var monitor1 = Monitor.of(window)
      monitor1.registerResolver(resolver1)

      var monitor2 = Monitor.of(document.body)
      monitor2.registerResolver(resolver2)

      window.dispatchEvent(new Event('scroll'))
      expect(resolver1.invoked).to.be.true
      expect(resolver2.invoked).to.be.false

      resolver1.invoked = false
      document.body.dispatchEvent(new Event('scroll'))
      expect(resolver2.invoked).to.be.true
      expect(resolver1.invoked).to.be.false
    })
  })
})
