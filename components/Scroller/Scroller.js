var focus = require('../focus')


/**
    * Generates one or several Scroller(s). A scroller is a widget that scrolles to specified targets on click
    * @constructor
    * @param {String} parentSelector - the selector that will determine the container(s) of the scroller(s)
    * @param {Object} obj - the scroller descriptor:
    *   class: an array of classes to be added to each scroller
    *   id: the id of the scroller, if specified the scroller will be generated only in the first container
    *   events: an array of the event object to bind on the scroller:
    *       type: a string representing the type of event
    *       handler: the callback of the event
    *   targets: an array of selectors, targets will be any element matching the selectors in the container
    */
function Scroller (parentSelector, obj) {
    var positionInNodeList = 0
    var parentEl = this.checkParent(parentSelector)
    var self = this
    /**
        * Generates scroller html and inserts it in the proper container in the DOM
        * @param {NodeList} container - contains element(s) scroller will be generated in, one scroller per element
        * @param {Object} descriptor - the scroller descriptor
        * @return {Array} an array of scroller data:
        *   hash: the hash of the generated scroller
        *   element: the scroller element as it is in the DOM
        *   targets: an array of selectors   
        *   container: the parent element the generated scroller
        *   addTarget: a method that adds target to the scroller
        *   removeTarget: a method that removes target from the scroller
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
        var res = [], ret
        Array.prototype.forEach.call(container, function (item, index) {
            descriptor.class.indexOf('basic_scroller') === -1 ? descriptor.class.push('basic_scroller'):''
            descriptor.class.indexOf('goingDown') === -1 ? descriptor.class.push('goingDown'):''
            classes = descriptor.class.join(' ')
            var hash = focus.generateHash()
            html = '<img id="' + descriptor.id + '" src="images/scroller_arrow_down.png" alt="scroller_arrow" data-index='+index+' class="'+classes+'" data-hash="'+hash+'">'
            ret = self.__proto__.generate(html, item, positionInNodeList)
            if(typeof descriptor.events !== 'undefined'){
                self.__proto__.delegateEvent(hash, descriptor.events)
            }
            ret.style.top = (item.tagName === 'BODY' ? document.documentElement.clientHeight : focus.removeUnity(item.style.height)) - 50 + 'px'              
            var elData = {
                hash: hash,
                element: ret,
                container: item,
                targets: descriptor.targets.slice(),
                addTarget: function (selector) {
                    if(this.targets.indexOf(selector) === -1) {
                        this.targets.push(selector)
                    }
                },
                removeTarget: function (selector) {
                    var index= this.targets.indexOf(selector)
                    if (index !== -1) {
                        this.targets.splice(index, 1)                            
                    }
                }
            }
            res = focus.recordElData(elData, res)
        })
        return res
    }
    /**
        * Scrolles the scroll area to the next target
        * @param {DOMelement} area - the scroll area
        * @param {Object} scrollDistances - the distance to scroll
        *   top: the distance to scroll on vertical axis as a Number
        *   left: the distance to scroll on horizontal axis as a Number
        */
    this.smoothScrollBy = function smoothScrollBy (area, scrollDistances) {
        var animation
        //  saves the position we've just scrolled to
        var previousScrollPos = {
            top: area.scrollTop,
            left: area.scrollLeft
        }
        //  position to reach
        var finalPositions = {
            top: area.scrollTop + scrollDistances.top,
            left: area.scrollLeft + scrollDistances.left
        }
        //  stores the increment to scroll, gets small as we are near to the target
        var increment = {
            top: 0,
            left: 0
        }
        //  the distance we have browsed
        var browsed = {
            top:0,
            left:0
        }
        animation = setInterval(function(){
            // increment calculation
            increment.top = (scrollDistances.top - browsed.top) * 0.3                
            increment.left = (scrollDistances.left - area.scrollLeft) * 0.3

            // we can't scroll by a value inf to 1 and sup to -1
            area.scrollTop += Math.abs(increment.top) < 1 ? Math.abs(increment.top)/increment.top  : increment.top
            area.scrollLeft += Math.abs(increment.left) < 1 ? Math.abs(increment.left)/increment.left  : increment.left
            browsed.top += increment.top
            browsed.left += increment.left

            // if we reach the target or if we can't reach it because of the length of the page
            // we stop scrolling
            if (((scrollDistances.top >= 0 && area.scrollTop >= finalPositions.top) 
                    || (scrollDistances.top <= 0 && area.scrollTop <= finalPositions.top)) 
                    && ((scrollDistances.left >= 0 && area.scrollLeft >= finalPositions.left)
                    || (scrollDistances.left <= 0 && area.scrollLeft <= finalPositions.left))
                    || (scrollDistances.top === 0 && previousScrollPos.left === area.scrollLeft
                    || scrollDistances.left === 0 && previousScrollPos.top === area.scrollTop
                    || scrollDistances.top !== 0 && scrollDistances.left !== 0
                    && previousScrollPos.left === area.scrollLeft && previousScrollPos.top === area.scrollTop)) {
                clearInterval(animation)
            }
            previousScrollPos.top = area.scrollTop
            previousScrollPos.left = area.scrollLeft
        },100)
    }
    /**
        * Gets the DOM elements corresponding to the targets in scrollArea and calculates their top position
        * relative to the scrollArea scrollTop.
        * @param {Number} scrollerId - the id of the scroller.
        * @param {Boolean} relative - if true, the position are calculated relative to the scrollArea scrollposition,
        *   the positions are absolute in the scrollArea
        * @return {Array} - a sorted array of the positions of the targets
        */
    this.getTargets = function getTargets (scrollerId, relative) {
        var targetsInScrollArea, targetEls= []
        var scrollerObj = self.generated()[scrollerId]
        var scrollArea = scrollerObj.container
        scrollerObj.targets.forEach(function(targetSelector){
            // we get the matching target elements in the scroll area 
            targetsInScrollArea = scrollArea.querySelectorAll(targetSelector)
            // then we gather them in the same array
            targetEls = targetEls.concat(Array.prototype.slice.call(targetsInScrollArea))                  
        })
        var offset = relative ? scrollArea.scrollTop : 0
        return targetEls.map(function (target){
            return focus.getPositionInArea(target, scrollArea).top - offset
        }).sort(function(a, b){
            return a - b
        })
    }

    /**
        * Adds target to all generated scrollers
        * @param {string} selector - the selector of the target  
        */
    this.addTarget = function addTarget (selector) {
        this.generated().forEach(function (scrollerObj) {
            scrollerObj.addTarget(selector)
        })
    }

    /**
        * removes target from all generated scrollers
        * @param {string} selector - the selector of the target  
        */
    this.removeTarget = function removeTarget (selector) {
        this.generated().forEach(function (scrollerObj) {
            scrollerObj.removeTarget(selector)
        })
    }
      
    if (!(obj.events instanceof Array)){
        obj.events = []
    }
    // Push a default click event in the events array
    obj.events.push({
        type: 'click',
        handler: 
            // On click we scroll to the nearest target according the direction of the scroller 
            function(e) {
                var distanceToNextTarget = 0
                // we determine the area to browse according the scroller that is clicked
                var scrollArea = e.target.parentElement
                // then we get the position of the targets relative to the scrollArea scroll position
                var targetRelativePosition = self.getTargets(e.target.dataset.index, true).filter(function(target){
                    // whether we are moving down or moving up we look to the target above or under the current scroll position
                    if(focus.hasClass(e.target, 'goingUp')){
                        return target < 0 
                    } else {
                        return target > 0
                    }
                })
                // if there is no targets to go, we return
                if (targetRelativePosition.length === 0) {return}

                distanceToNextTarget = targetRelativePosition[0] < 0 ? targetRelativePosition.pop() : targetRelativePosition.shift()
                // scroll the scrollArea
                self.smoothScrollBy(scrollArea, {
                    top: distanceToNextTarget,
                    left: 0
                })
            }
    })

       

    var previousScrollPos= {
        top:0,
        left:0
    } 
    // here we update the scroller element on scroll of window
    window.onscroll = function(){
        var scroller = document.querySelector('body .basic_scroller')
        var targets = self.getTargets(scroller.dataset.index)
        var highest = targets[0]
        var lowest = targets[targets.length - 1]

        if (this.scrollY > previousScrollPos.top ) {
            focus.hasClass(scroller, 'goingDown') ? '' : focus.removeClass(scroller, 'goingUp').addClass(scroller, 'goingDown') 
        } else if (this.scrollY < previousScrollPos.top ) {
            focus.hasClass(scroller, 'goingUp') ? '' : focus.removeClass(scroller, 'goingDown').addClass(scroller, 'goingUp') 
        }
        if (this.scrollY <= highest || this.scrollY === 0) {
            focus.hasClass(scroller, 'goingDown') ? '' : focus.removeClass(scroller, 'goingUp').addClass(scroller, 'goingDown') 
        }
        if (document.documentElement.scrollHeight === this.scrollY + document.documentElement.clientHeight || this.scrollY >= lowest){
            focus.hasClass(scroller, 'goingUp') ? '' : focus.removeClass(scroller, 'goingDown').addClass(scroller, 'goingUp') 
        }
        // simulating position fixed
        scroller.style.top = focus.removeUnity(scroller.style.top) + (this.scrollY - previousScrollPos.top) + 'px'
        previousScrollPos.top = this.scrollY
    }        

    var generated = this.generate(parentEl, obj)
    /**
        *   Gets the Scroller updated data
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
    // here we update the scroller element on scroll of any other element than window
    Array.prototype.forEach.call(self.generated(), function(scrollObj, index) {
        var previousScrollPos = {top:0}, scroller, highest, lowest, targets
        var scrollArea = scrollObj.container
        focus.bindEvent(scrollArea, [{
            type: 'scroll',
            handler: function () {
                scroller = scrollObj.element
                targets = self.getTargets(index)
                highest = targets[0]
                lowest = targets[targets.length - 1]
                if (this.scrollTop > previousScrollPos.top) {
                    focus.hasClass(scroller, 'goingDown') ? '' : focus.removeClass(scroller, 'goingUp').addClass(scroller, 'goingDown') 
                } else if (this.scrollTop < previousScrollPos.top) {
                    focus.hasClass(scroller, 'goingUp') ? '' : focus.removeClass(scroller, 'goingDown').addClass(scroller, 'goingUp') 
                }
                if (this.scrollTop <= highest || this.scrollTop === 0) {
                    focus.hasClass(scroller, 'goingDown') ? '' : focus.removeClass(scroller, 'goingUp').addClass(scroller, 'goingDown') 
                }
                if (this.scrollHeight === this.scrollTop + this.clientHeight || this.scrollTop >= lowest){
                    focus.hasClass(scroller, 'goingUp') ? '' : focus.removeClass(scroller, 'goingDown').addClass(scroller, 'goingUp') 
                }
                // simulating position fixed
                scroller.style.top =   focus.removeUnity(this.style.height) - 50 + this.scrollTop + 'px'
                previousScrollPos.top = this.scrollTop
            }
        }])
    })
}

Scroller.prototype = focus
module.exports = Scroller