describe('Monitor', function () {
  var Monitor = window.Monitor || window.scrollMonitor.Monitor

  function Resolver() {
    this.resolve = function () {
    }
  }

  beforeEach('clear monitors', function () {
    Monitor.clear()
  })

  it('should define Monitor properly', function () {
    expect(Monitor).to.be.a('function')
  })

  describe('BaseResolver', function () {
    describe('$getter', function () {
      it('should return the BaseResolver as a function', function () {
        expect(Monitor.BaseResolver).to.be.a('function')
      })
    })

    describe('@constructor', function () {
      it('should create a resolver without ticking when interval is not supplied', function () {
        var resolver = new Monitor.BaseResolver(window)
        expect(resolver).to.not.have.property('_ticker')
      })

      it('should create a resolver with ticking when interval is supplied, even though it is null', function () {
        expect(new Monitor.BaseResolver(window, null)).to.have.property('_ticker')
        expect(new Monitor.BaseResolver(window, 100)._ticker).to.have.property('interval', 100)
      })

      it('should throw error when subscriber is invalid', function () {
        expect(function () {
          new Monitor.BaseResolver({})
        }).to.throw()
      })
    })

    describe('$subscriber', function () {
      it('should return the subscriber', function () {
        expect(new Monitor.BaseResolver(window)).to.have.property('subscriber', window)
      })

      it('should set the subscriber successfully when it is valid', function () {
        var resolver = new Monitor.BaseResolver(window)
        resolver.subscriber = document
        expect(resolver).to.have.property('subscriber', document)
      })

      it('should throw error when set a invalid subscriber to resolver', function () {
        expect(function () {
          new Monitor.BaseResolver(window).subscriber = {}
        }).to.throw()
      })
    })

    describe('#resolve', function () {
      it('should do nothing by default', function () {
        var resolver = new Monitor.BaseResolver(window)
        expect(function () {
          resolver.resolve()
        }).not.to.throw()
      })

      it('should invoke function _doResolver as expected', function () {
        var resolver = new Monitor.BaseResolver(window)
        resolver._doResolve = function () {
          this.executed = true
        }
        resolver.resolve(null, null, null)
        expect(resolver.executed).to.be.true
      })

      it('should invoke function _doResolver with ticking when interval is specified', function (done) {
        var resolver = new Monitor.BaseResolver(window, 100)
        resolver.count = 0
        resolver._doResolve = function () {
          this.count++
        }
        resolver.resolve()
        expect(resolver.count).to.be.equal(1)

        resolver.resolve()
        expect(resolver.count).to.be.equal(1)

        setTimeout(function () {
          resolver.resolve()
          expect(resolver.count).to.be.equal(2)
          done()
        }, 100)
      })
    })
  })

  describe('Util', function () {
    describe('$getter', function () {
      it('should return as an Object', function () {
        expect(Monitor.Util).to.be.a('object')
      })
    })

    describe('@splitString', function () {
      it('should split string using spaces as separator by default', function () {
        var string = ' a  b   c   '
        expect(Monitor.Util.splitString(string)).to.have.all.members(['a', 'b', 'c'])
      })

      it('should split string using specified separator', function () {
        var string = ' a , b,c '
        expect(Monitor.Util.splitString(string, /,/g)).to.have.all.members([' a ', ' b', 'c '])
      })
    })
  })

  describe('@constructor', function () {
    it('should create a monitor properly', function () {
      var monitor = new Monitor(window)
      expect(monitor).to.be.an.instanceof(Monitor)
      expect(Monitor.monitors).to.include(monitor)

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

    it('should destroy and then return a new monitor when the monitor of target has been created', function () {
      var origin = new Monitor(window)
      expect(Monitor.monitors.has(window)).to.be.true
      expect(Monitor.of(window)).to.be.equal(origin)
      var after = new Monitor(window)
      expect(Monitor.of(window)).to.be.equal(after).and.not.be.equal(origin)
    })
  })

  describe('@NAMESPACE', function () {
    it('should return NAMESPACE as a string', function () {
      expect(Monitor).to.have.property('NAMESPACE').that.is.a('string')
    })
  })

  describe('@monitors', function () {
    it('should return an empty map if there has not any monitors created', function () {
      expect(Monitor.monitors).to.be.empty
    })

    it('should return a map contains all monitors', function () {
      var target1 = window
      Monitor.of(target1)
      expect(Monitor.monitors).to.have.key(target1).and.have.property('size', 1)

      var target2 = document.body
      Monitor.of(target2)
      expect(Monitor.monitors).to.have.all.keys(target1, target2).and.have.property('size', 2)
    })

    it('should not modify origin map if add or remove monitors to/from returned map', function () {
      Monitor.of(window)
      expect(Monitor.monitors).to.have.key(window)

      var copy = Monitor.monitors
      copy.clear()
      expect(copy).to.be.empty
      expect(Monitor.monitors).to.have.key(window)
    })
  })

  describe('@of', function () {
    it('should throw error when target is invalid', function () {
      expect(function () {
        Monitor.of(Monitor)
      }).to.throw()
    })

    it('should create a new monitor when the monitor of the target have not been created', function () {
      var target = window
      expect(Monitor.monitors.get(target)).to.not.exist
      expect(Monitor.of(target)).to.exist.and.be.an.instanceof(Monitor)
      expect(Monitor.monitors.get(target)).to.exist.and.be.an.instanceof(Monitor)
    })

    it('should return same monitor when the monitor of the target has been created', function () {
      var target = window
      var monitor = new Monitor(target)
      expect(Monitor.monitors.get(target)).to.exist
      expect(Monitor.of(target)).to.be.equal(monitor)
      expect(Monitor.of(target)).to.be.equal(Monitor.of(target))
    })
  })

  describe('@clear', function () {
    it('should destroy all monitors', function () {
      Monitor.of(window)
      expect(Monitor.monitors).to.not.be.empty

      Monitor.clear()
      expect(Monitor.monitors).to.be.empty
    })
  })

  describe('@_resolveMetric', function () {
    it('should throw error when target is not valid', function () {
      expect(function () {
        Monitor._resolveMetric(Monitor)
      }).to.throw()
    })

    it('should return a ScrollMetric when target is valid', function () {
      var scrollMetric = Monitor._resolveMetric(window)
      expect(scrollMetric).to.have.property('scrollHeight').that.is.a('number')
      expect(scrollMetric).to.have.property('scrollWidth').that.is.a('number')
      expect(scrollMetric).to.have.property('viewHeight').that.is.a('number')
      expect(scrollMetric).to.have.property('viewWidth').that.is.a('number')
      expect(scrollMetric).to.have.property('top').that.is.a('number')
      expect(scrollMetric).to.have.property('left').that.is.a('number')
      expect(scrollMetric).to.have.property('bottom').that.is.a('number')
      expect(scrollMetric).to.have.property('right').that.is.a('number')
    })
  })

  describe('@_checkTarget', function () {
    it('should not throw error when target is an instance of Window or Element or Document', function () {
      expect(function () {
        Monitor._checkTarget(window)
      }).to.not.throw()

      expect(function () {
        Monitor._checkTarget(document.body)
      }).to.not.throw()

      expect(function () {
        Monitor._checkTarget(document)
      }).to.not.throw()
    })

    it('should throw error when target is not valid', function () {
      expect(function () {
        Monitor._checkTarget(Monitor)
      }).to.throw()
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
    it('should return a set contains all resolvers', function () {
      var monitor = Monitor.of(window)
      expect(monitor.resolvers).to.be.empty

      var resolver = new Resolver()
      monitor.addResolver(resolver)
      expect(monitor.resolvers).to.have.key(resolver)

      monitor.resolvers.delete(resolver)
      expect(monitor.resolvers).to.have.key(resolver)
    })
  })

  describe('#addResolver', function () {
    it('should add resolver successfully when resolver is a function', function () {
      var monitor = Monitor.of(window)
      monitor.addResolver(function () {
      })
      expect(monitor.resolvers).to.have.property('size', 1)
      monitor.resolvers.forEach(function (value) {
        expect(value).to.respondTo('resolve')
      })
    })

    it('should add resolver successfully when resolver is an object that contains a function named resolve', function () {
      var resolver = new Resolver()
      var monitor = Monitor.of(window)
      monitor.addResolver(resolver)
      expect(monitor.resolvers).to.have.key(resolver)
    })

    it('should throw error when resolver is not a function or a valid object', function () {
      expect(function () {
        Monitor.of(window).addResolver({})
      }).to.throw()
    })
  })

  describe('#removeResolver', function () {
    it('should remove resolver successfully', function () {
      var resolver = new Resolver()
      var monitor = Monitor.of(window)

      monitor.addResolver(resolver)
      expect(monitor.removeResolver(Monitor)).to.be.false
      expect(monitor.resolvers).to.have.key(resolver)

      expect(monitor.removeResolver(resolver)).to.be.true
      expect(monitor.resolvers).to.be.empty
    })
  })

  describe('#clearResolvers', function () {
    it('should remove all resolvers', function () {
      var monitor = Monitor.of(window)
      monitor.addResolver(new Resolver())
      monitor.addResolver(new Resolver())
      monitor.clearResolvers()
      expect(monitor.resolvers).to.be.empty
    })
  })

  describe('#destroy', function () {
    it('should destroy the monitor properly', function () {
      var monitor = Monitor.of(window)
      monitor.destroy()

      expect(Monitor.monitors).to.not.include(monitor)
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
      monitor1.addResolver(resolver1)

      var monitor2 = Monitor.of(document.body)
      monitor2.addResolver(resolver2)

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
