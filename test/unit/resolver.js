var Resolver = window.Resolver || window.scrollMonitor.Resolver

describe('Resolver', function () {
  it('should Resolver defined properly', function () {
    expect(Resolver).to.be.a('function')
  })

  describe('static #VERSION', function () {
    it('should return as a string', function () {
      expect(Resolver).to.have.property('VERSION').that.is.a('string')
    })
  })

  describe('static #NAMESPACE', function () {
    it('should return as a string', function () {
      expect(Resolver).to.have.property('NAMESPACE').that.is.a('string')
    })
  })

  describe('#constructor', function () {
    it('should return a new Resolver properly', function () {
      expect(new Resolver()).to.be.an.instanceof(Resolver)
    })
  })

  describe('#eventTypes', function () {
    it('should return undefined', function () {
      expect(new Resolver()).to.have.property('eventTypes').that.is.undefined
    })
  })

  describe('#resolve', function () {
    it('should throw Error', function () {
      expect(new Resolver().resolve).to.throw()
    })
  })
})
