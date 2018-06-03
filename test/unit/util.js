var Util = window.Util || window.scrollMonitor.Util

describe('Util', function () {
  describe('#createEvent', function () {
    it('should return event with default options', function () {
      var event = Util.createEvent('test')
      expect(event).to.have.property('type').that.equals('test')
      expect(event).to.have.property('bubbles').that.is.false
      expect(event).to.have.property('cancelable').that.is.false
      if (!document.documentMode) {
        expect(event).to.have.property('composed').that.is.false
      }
    })

    it('should return event with specified options', function () {
      var event = Util.createEvent('test', {bubbles: true, cancelable: true, composed: true})
      expect(event).to.have.property('type').that.equals('test')
      expect(event).to.have.property('bubbles').that.is.true
      expect(event).to.have.property('cancelable').that.is.true
      if (!document.documentMode) {
        expect(event).to.have.property('composed').that.is.true
      }
    })
  })
})
