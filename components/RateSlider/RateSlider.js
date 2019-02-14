/**
    * Generates one or several RateSliders
    * @constructor
    * @param {String} parentSelector - the selector that will determine the container(s) of the slider(s)
    * @param {Object} obj - the slider descriptor:
    *   class: an array of classes to be added to each RateSlider
    *   id: the id of the rateslider, if specified the rateslider will be generated only in the first container
    *   events: an array of the event object to bind on the rateslider:
    *       type: a string representing the type of event
    *       handler: the callback of the event
    *   maxRate: the maximum rate on the rateslider, as a number
    *   initialValue: initial value of the rateslider, as a number
    *   readOnly: if we don't want ui to set rateslider value, readOnly should be set true. Default value is false
    *   pattern: the pattern of the rateslider (star, dollars...) can be passed as a string or as an unicode utf-8 value. default value is: &#9733
    *   activeColor: the color of the active items. Default value is : rgb(255, 221, 153) 
    * @param {Number} positionInNodeList - the position of the slider between its siblings
    */
function RateSlider (parentSelector, obj, positionInNodeList) {
    var parentEl = this.checkParent(parentSelector)
    var self = this
    if (!(obj.events instanceof Array)){
        obj.events = []
    }
    obj.events.push({
        type: 'mouseout',
        handler: 
            function (e) {
                self.fill(self.generated()[e.target.dataset.index].rate, e.target.children)
            }
    })

    /**
        * Generates rateslider html and inserts it in the proper container in the DOM
        * @param {NodeList} container - contains element(s) rateslider will be generated in, one rateslider per element
        * @param {Object} descriptor - the rateslider descriptor
        * @return {Array} an array of rateslider data:
        *   hash: the hash of the generated rateslider
        *   element: the rateslider element as it is in the DOM
        *   rate: the value of the rateslider as a number   
        *   container: the parent element the generated rateslider
        */
    this.generate = function (container, descriptor) {
        var html = ''
        var classes = ''
        if (typeof descriptor.id !== 'undefined') {
            container = [container[0]]
        }
        if (!(descriptor.class instanceof Array)) {
            descriptor.class = []
        }
        var res = []
        Array.prototype.forEach.call(container, function (item, index) {
            descriptor.class.indexOf('basic_rateSlider') === -1 ? descriptor.class.push('basic_rateSlider'):''
            classes = descriptor.class.join(' ')
            var hash = focus.generateHash()
            html = '<div id="' + descriptor.id + '" class="' + classes + '" data-hash=' + hash + ' data-index=' + index + '>'
            for (var i = 1; i <= descriptor.maxRate; i++) {
                html += '<div class="rateItem" data-hash='+focus.generateHash()+'  data-rate=' + i + '>' + (descriptor.pattern || '&#9733') + '</div>'
            }
            html += '</div>'
            var ret = self.__proto__.generate(html, item, positionInNodeList)
            if(typeof descriptor.events !== 'undefined') {
                self.delegateEvent(hash, descriptor.events)
            }
            self.fill(descriptor.initialValue, ret.children)
            if (!descriptor.readOnly) {
                Array.prototype.forEach.call(ret.children, function (rateItem, id) {
                    focus.bindEvent(rateItem, [{
                        type: 'mouseenter',
                        handler: function (e) {
                            self.fill(e.target.dataset.rate, self.generated()[index].element.children)
                        }
                    }, {
                        type: 'click',
                        handler: function (e) {
                            self.generated()[index].rate = e.target.dataset.rate 
                        }
                    }])
                })
            }
            var elData = {
                hash: hash,
                element: ret,
                container: item,
                rate: descriptor.initialValue
            }
            res = focus.recordElData(elData, res)
        })
        return res
    }

    /**
        * Set the value of the specified rateslider
        * @param {Number} rate - the value to set
        * @param {Object} rateSlider - a rateSlider data object as it is returned by this.generated()
        *                              if there is no rateSlider specified every element of this.generated will be set
        */
    this.setValue =  function (rate, rateSlider) {
        if (rateSlider) {
            rateSlider.rate = rate
            this.fill(rate, rateSlider.element.children)
        } else {
            var self = this
            this.generated().forEach(function (rateSlider) {
                self.setValue(rate, rateSlider)
            })
        }
    }

    /**
        *   Colores the rateSlider according its rate
        *   @param {Number} rate - the rate of the rateSlider
        *   @param {NodeList} siblings - the rateSlider's rateItems
        */
    this.fill = function (rate, siblings) {
        for (var i=1; i<= rate; i++) {
            siblings[i - 1].style.color = obj.activeColor || 'rgb(255, 221, 153)'
        }
        for(i; i<= obj.maxRate; i++) {
            siblings[i - 1].style.color = 'rgb(190, 190, 190)'
        }
    }

    var generated = this.generate(parentEl, obj)

    /**
        *   Gets the Rateslider updated data
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


RateSlider.prototype = focus