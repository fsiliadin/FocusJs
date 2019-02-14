// focus, the root object that all basic component inherit
// it defines generic methods 
var focus = {
    // event referential array that lists events and their element
    eventsArray: [],
    // focus widget's relevant data are kept and updated in this array
    elDataArray: [],
    // DOM element that are being dragged/dropped
    dragDropEl: [],

    /**
        * Records data of any generated widget in elDataArray
        * @param {Object} elData - the data of the generated widget
        * @param {Array} res - an array of data of each generated widget with the same constructor call
        * @return {Array} - elData pushed into res 
        */
    recordElData: function (elData, res) {
        res.push(elData)
        focus.elDataArray.push(elData)
        return res
    },

    /**
        * Retrieves a focus generated element by its hash
        * @param {String} hash - the hash of the seeked element
        * @return {Object} - elData of the element corresponding to the hash
        */
    findElementByHash: function (hash) {
        return focus.elDataArray.filter(function (elData) {
            return elData.hash == hash
        })[0]
    },

    /**
        * Updates a widget revelant data (useful in case of multiple insertion of same element)
        * @param {DOMelement} el - the widget element to update
        */
    updateElData: function (el) {
        var dataToUpdate = focus.findElementByHash(el.dataset.hash)
        if(dataToUpdate) {
            dataToUpdate.element = el
            dataToUpdate.container = el.parentElement
            if ('gridItems' in dataToUpdate) {
                dataToUpdate.gridItems = el.children
            }
            if('navButtons' in dataToUpdate) {
                dataToUpdate.navButtons = el.children
            }
            if ('subSliders' in dataToUpdate) {
                var subSliders = dataToUpdate.element.querySelectorAll('.subSlideZone')
                dataToUpdate.subSliders.forEach(function(subSlider, index){
                    subSlider.element = subSliders[index]
                })
            }
            if ('selectedItems' in dataToUpdate) {
                dataToUpdate.selectedItems = Array.prototype.filter.call(dataToUpdate.gridItems, function(gridItem) {
                    return focus.hasClass(gridItem, 'selected')
                })
            }
        }
            
    },

    /**
        * The only function that inserts html into the DOM
        * @param {String} htmlStr - the html string to be inserted
        * @param {DOMElment} parentEl - the element in which the new html will be generated
        * @param {Number} positionInNodeList - the position the html will be insert at
        * @return {DOMElement} - the generated element
        */
    generate : function generate(htmlStr, parentEl, positionInNodeList) {
        var siblings = parentEl.children
        // if the programmer doesn't specify any position by default the position is the last
        if (typeof positionInNodeList === 'undefined' || positionInNodeList > siblings.length - 1) {
            if (siblings.length) { // if parentEl has children
                siblings[siblings.length - 1].insertAdjacentHTML('afterend', htmlStr)
            } else {
                parentEl.innerHTML += htmlStr
            }
            // if the generated element "existed" before this function call (reinsertion) we rebind
            // its events on it after reinsertion
            this.rebindEvents(parentEl.children[siblings.length - 1])
            return parentEl.children[siblings.length - 1]
        } else {
            siblings[positionInNodeList].insertAdjacentHTML('beforebegin', htmlStr)
            this.rebindEvents(parentEl.children[positionInNodeList])
            return parentEl.children[positionInNodeList]
        }
    },

    /** 
        * Generates a unique hash
        * @return {Number} a random number
        */
    generateHash: function generateHash(){
        return (Math.pow(2,32)*Math.random()+1)/(1000*Math.random()+1)*Math.exp(10*Math.random()+1)
    },

    /**
        * Delegates events to the body
        * @param {DOMElement} el - the element to bind the event to
        * @param {Array} events - array of objects describing the events:
        *   type: a string representing the type of event
        *   handler: the event's callback
        */
    delegateEvent: function delegateEvent(el, events) {
        events.forEach(function(event){
            focus.bindEvent(document.querySelector('body'), [{
                type: event.type,
                handler: function(e) {
                    if (e.target.dataset.hash===el+'') {
                        event.handler(e)
                    }
                }
            }])
        })
        // events.forEach(function(event){
        //     focus.bindEvent(document.querySelector("[data-hash='"+el+"']"), event);
        // });
    },

    /**
        * Unlike delegateEvent this function attaches event directly to an element
        * @param {DOMElement} el - the element to bind the event to
        * @param {Array} event - array of events to be attached:
        *   type: a string representing the type of event
        *   handler: the event's callback
        */
    bindEvent: function bindEvent(el, events) {
        events.forEach(function(event) {
            focus.eventsArray.push({
                hash: el.dataset.hash,
                event: event
            })
            if (!(event.type instanceof Array)) {
                el.addEventListener(event.type, event.handler, event.capture)
            } else {
                event.type.forEach(function(eventType){
                    el.addEventListener(eventType, event.handler, event.capture)
                })
            }
        })
    },

    /**
        * Rebinds the undelegates events of an element on element
        * it's useful is case of multiple reinsertion of the "same" element in the DOM
        * @param {DOMElement} el - the element to rebind events to        *
        */
    rebindEvents: function rebindEvents(el) {
        focus.updateElData(el)
        focus.eventsArray.filter(function (event) {
            return event.hash && (event.hash == el.dataset.hash)
        }).forEach(function(event) {

            el.addEventListener(event.event.type, event.event.handler)
        })
        if (el.children.length) {
            Array.prototype.forEach.call(el.children, function(child) {
                focus.rebindEvents(child)
            })
        }
    },

    /**
        * Gets the elements corresponding to a selector if it exist, else throw an error
        * @param {String} parentSelector - the selector of the element(s)
        * @return {NodeList} - the selected element(s)
        */
    checkParent: function checkParent(parentSelector) {
        try {
            if (parentSelector == false) {
                parentEl = document.querySelectorAll('body')
            } else {
                parentEl = document.querySelectorAll(parentSelector)
            }
            return parentEl
        } catch (error) {
            console.error (error.message)
        }
    },

    render: function render(){

    },

    hasClass: function hasClass(element, _class) {
        return Array.prototype.indexOf.call(element.classList, _class) > -1
    },

    removeClass: function removeClass (element, _class) {
        element.className = element.className.replace(_class, '')
        // we return focus so that we can chain function call
        return this
    },

    addClass: function addClass (element, _class) {
        // _class could be an array of classes
        element.className += ' '+_class.toString()
    },
    removeUnity: function removeUnity (str) {
        var strArr = str.split('')
        strArr.splice(strArr.length - 2, 2)
        return strArr.join('') | 0
    },

    // this function returns the position of an element relative to the specified area
    // the element shall exist in that area
    getPositionInArea: function getPositionInArea(el, area) {
        var pos = {
            top : 0,
            left : 0
        }
        function getPosition(el){
            pos.top += el.offsetTop
            pos.left += el.offsetLeft
            if(el.offsetParent !== area){
                getPosition(el.offsetParent)
            }
            return pos
        }
        return getPosition(el)
    }

} //focus