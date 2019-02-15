var focus = require('../focus')
/**
    * Generates one or several Button(s).
    * @constructor
    * @param {String} parentSelector - the selector that will determine the container(s) of the button(s)
    * @param {Object} obj - the Button descriptor:
    *   class: an array of classes to be added to each Button
    *   id: the id of the Button, if specified the Button will be generated only in the first container
    *   events: an array of the event object to bind on the button:
    *       type: a string representing the type of event
    *       handler: the callback of the event
    *   text: the text on the button
    * @param {Number} positionInNodeList - the position of the button between its siblings
    */
function Button(parentSelector, obj, positionInNodeList){
    /**
        * Generates button html and inserts it in the proper container in the DOM
        * @param {NodeList} container - contains element buttons will be generated in. (one button per element)
        * @param {Object} descriptor - the button descriptor
        *
        * @return {Array} an array of button data:
        *   hash: the hash of the generated button
        *   element: the button element as it is in the DOM   
        *   container: the parent element of each generated button
        *   changeText: a method that changes the text of a specific button
        */
    var parentEl = this.checkParent(parentSelector)
    var self = this

    this.generate = function (container, descriptor) {
        var html= ''
        var classes= ''
        var res = [], ret
        // if the programmer specifies an id, only the first node el is taken in account
        // can't have several object with the same id
        if(typeof descriptor.id !== 'undefined') {
            container = [container[0]]
        }
        if (!(descriptor.class instanceof Array)) {
            descriptor.class = []
        }
        var self = this
        // for each node el taken in account is generated an html
        Array.prototype.forEach.call(container, function(item, index){
            descriptor.class.indexOf('basic_button') === -1 ? descriptor.class.push('basic_button'): ''
            classes = descriptor.class.join(' ')
            // creation of a hash to identify each element
            var hash = focus.generateHash()
            html = '<div id="'+descriptor.id+'" class ="'+classes+'" data-hash="'+hash+'">'+descriptor.text+'</div>'
            ret = self.__proto__.generate(html, item, positionInNodeList)
            var elData = {
                hash: hash,
                element: ret,
                container: item,
                changeText: function (text) {
                    this.element.innerHTML = text
                }
            }
            res = focus.recordElData(elData, res)
            if(typeof descriptor.events !== 'undefined') {
                self.delegateEvent(hash, descriptor.events)
            }
        })
        return res
    }
        
    /**
        * Changes the text of all generated Button
        * @param {string} text - the new text
        */
    this.changeText = function (text) {
        self.generated().forEach(function (button) {
            button.changeText(text)
        })
    }


    var generated = this.generate(parentEl, obj)
    /**
        *   Gets the Button updated data
        */
    this.generated = function () {
        /*  variable "generated" is captured from above, but the elements it contains can be obsolete (does not reflect the actual DOM element)
                since those elements refers to the elements generated on this.generate() call. So we base on the hash to retrieve the actual DOM element in
                elDataArray which elements are kept up to date on every widget modification in the DOM 
            */
        var toReturn = []
        generated.forEach(function(generatedEl){
            // searches the generated widget referential array and returns the one corresponding to the specified hash
            toReturn.push(focus.elDataArray.filter(function(elData){
                return elData.hash == generatedEl.hash
            })[0])
        })
        // /!\generatedEl is just for debug, don't base anything on it /!\
        self.generatedEl = toReturn
        return toReturn
    }
}


Button.prototype = focus
module.exports = Button