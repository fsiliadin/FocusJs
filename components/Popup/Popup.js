var focus = require('../focus.js')

function Popup(parentSelector, obj) {
    var parentEl = this.checkParent(parentSelector)
}


Popup.prototype = focus
module.exports = Popup