(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var focus = require('../focus.js')

/**
    * Generates one or several Grid(s)
    * @constructor
    * @param {String} parentSelector - the selector that will determine the container(s) of the grid(s)
    * @param {Object} obj - the grid descriptor:
    *   class: an array of classes to be added to each Grid (add 'listAlikeGrid' class to make grid behave like a list)
    *   id: the id of the grid, if specified the grid will be generated only in the first container
    *   events: an array of the event object to bind on the grid:
    *       type: a string representing the type of event
    *       handler: the callback of the event
    *   itemWidth: the width of grid items, if not specified item will wrap its content
    *   itemHeight: the height of the grid items, if not specifies but itemWidth is specified itemHeight = itemWidth
    *   nbItems: the number of items in the grid
    *   checkable: 'multiple'/'single'/<default> either the grid can behave like a radiobutton or not. Multiple means several item can be clicked
    *   contents: An array of content object that grid items will be generated from. contents.length replaces nbItems:
    *       content: an html string or any focus generated widget
    *       width: the width of grid item the content will be insert in, if not specified item will wrap its content
    *       height: the height of the grid item the content will be insert in, if not specifies but width is specified height = width
    * @param {Number} positionInNodeList - the position of the grid between its siblings
    */
function Grid(parentSelector, obj, positionInNodeList){
    var parentEl = this.checkParent(parentSelector)
    var self = this
    /**
        * Generates grid html and insert it in the proper container in the DOM
        * @param {NodeList} container - contains element grids will be generated in. (one grid per element)
        * @param {Object} descriptor - the grid descriptor
        * @return {Array} an array of grid data:
        *   hash: the hash of the generated grid
        *   element: the grid element as it is in the DOM
        *   gridItems: a NodeList of the grid items   
        *   container: the parent element of each generated grid
        *   selectedItems: the selected items of the grid
        */
    this.generate = function (container, descriptor) {
        var html = ''
        var classes  = ''
        var res = [], ret
        if (typeof descriptor.id !== 'undefined') {
            container = [container[0]]
        }
        if (!(descriptor.class instanceof Array)) {
            descriptor.class = []
        }
        Array.prototype.forEach.call(container, function (item, index){
            if(descriptor.class.indexOf('listAlikeGrid') === -1) {
                descriptor.class.indexOf('basic_grid') === -1 ? descriptor.class.push('basic_grid'):''
            } else {
                descriptor.class.push('listAlikeGrid')
            }
            classes = descriptor.class.join(' ')
            var hash = focus.generateHash()
            var L = descriptor.itemWidth
            var l = descriptor.itemHeight ? descriptor.itemHeight : L
            html = '<div id ="'+descriptor.id+'" class="'+classes+'" data-hash="'+hash+'" data-index="'+index+'">'
            if (!('contents' in descriptor)) {
                for (var i = 0; i < descriptor.nbItems; i++) {
                    html += self.buildItem({
                        width: descriptor.itemWidth, 
                        height: descriptor.itemHeight
                    }, i, hash)
                }
            } else {
                descriptor.contents.forEach(function (content, index) {
                    html += self.buildItem(content, index, hash)
                })
            }
                
            html += '</div>'
            ret = self.__proto__.generate(html, item, positionInNodeList)
            Array.prototype.forEach.call(ret.children, function (child){
                self.addGridItemMethods(child)
                if(descriptor.checkable) {
                    focus.bindEvent(child, [{
                        type: 'click',
                        handler: function(event){
                            var currentGrid = self.generated()[index]
                            if(!focus.hasClass(child, 'selected')) {
                                focus.addClass(child, 'selected')
                                if (descriptor.checkable ==='single') {
                                    currentGrid.selectedItems.forEach(function(selectedItem) {
                                        focus.removeClass(selectedItem, 'selected')
                                    })
                                    currentGrid.selectedItems.length = 0
                                }
                                currentGrid.selectedItems.push(child)
                            } else {
                                focus.removeClass(child, 'selected')
                                currentGrid.selectedItems.splice(currentGrid.selectedItems.indexOf(child), 1)
                            }
                        }
                    }])
                }
                    
            })
            var elData = {
                hash: hash,
                element: ret,
                container: item,
                gridItems: ret.children,
                checkable: descriptor.checkable,
                selectedItems: []
            }
            res = focus.recordElData(elData, res)
            if(typeof descriptor.events !== 'undefined') {
                self.delegateEvent(hash, descriptor.events)
            }
        })
        return res
    }

    /**
        * Attaches "default" methods to grid items
        * @param {DOM Element} - the grid item element
        * @return {DOM Element} - the grid item element extended with the methods
        */
    this.addGridItemMethods = function (gridItem) {
        var self = this
        gridItem.addContent = function(obj) {
            var content
            if(typeof obj.content === 'object') {
                content = obj.content.generated()[0].element.outerHTML
                obj.content.generated()[0].element.remove()
            } else {
                content = '<span data-hash= ' + focus.generateHash() + '>' + obj.content + '</span>'
            }
            self.__proto__.generate(content, this, obj.positionInNodeList)
        }
        gridItem.clearContent = function() {
            this.innerHTML = ''
        }
        gridItem.modify = function(dimensions) {
            this.style.height = dimensions.height
            this.style.width =  dimensions.width
        }
        gridItem.select = function select() {
            this.unselect()
            focus.addClass(this, 'selected')
            focus.findElementByHash(this.dataset.gridofbelonging).selectedItems.push(this)          
        }
        gridItem.unselect = function unselect() {               
            focus.removeClass(this, 'selected')
            var selectedItemArray = focus.findElementByHash(this.dataset.gridofbelonging).selectedItems
            var ind = selectedItemArray.indexOf(this)
            ind !== -1 ? selectedItemArray.splice(ind,1) : ''
        }
        return gridItem
    }
    /**
        * Adds specified item to the grid
        * @param {Object} - params 
        *   to: the grid to add the item to, since the Grid constructor generates a grid per parent, there could be several grid generated.
        *       Therefore we should specify the one we want to add the item to,
        *       otherwise the item will be added to every generated grid
        *   content: the content of the gridItem, can be passed as html string or as any focus-generated element
        *   events: an array of the event object to bind on the gridItem:
        *   type: a string representing the type of event
        *   handler: the callback of the event
        *   positionInNodeList: the position of the item withing the other items in the grid
        * @return {Array} - an array of the newly generated items
        */
    this.addItem = function (params) {
        var itemHtml 
        var self = this
        var addedItems = []
        if(!(params.events instanceof Array)) {
            params.events = []
        }  
        if (params.to) {
            itemHtml = this.buildItem(params, params.positionInNodeList, params.to.element.dataset.hash)
            addedItems.push(this.addGridItemMethods(this.__proto__.generate(itemHtml, params.to.element, params.positionInNodeList)))
        } else {
            this.generated().forEach(function (grid) {
                itemHtml = self.buildItem(params, params.positionInNodeList, grid.element.dataset.hash)
                addedItems.push(self.addGridItemMethods(self.__proto__.generate(itemHtml, grid.element, params.positionInNodeList)))
            })
        }
        if(this.generated()[0].checkable){
            addedItems.forEach(function(addedItem){
                params.events.push({
                    type: 'click',
                    handler: function(event){
                        var currentGrid = focus.findElementByHash(this.dataset.gridofbelonging)
                        if(!focus.hasClass(addedItem, 'selected')) {
                            focus.addClass(addedItem, 'selected')
                            if (currentGrid.checkable ==='single') {
                                currentGrid.selectedItems.forEach(function(selectedItem) {
                                    focus.removeClass(selectedItem, 'selected')
                                })
                                currentGrid.selectedItems.length = 0
                            }
                            currentGrid.selectedItems.push(addedItem)
                        } else {
                            focus.removeClass(addedItem, 'selected')
                            currentGrid.selectedItems.splice(currentGrid.selectedItems.indexOf(addedItem), 1)
                        }
                    }
                })
                focus.bindEvent(addedItem, params.events)                
            })
        }
            
        return addedItems
    }

    /**
        * populates a grid with an array of contents
        * @param {Object} - params
        *   grid:   the grid to populate, since the Grid constructor generates a grid per parent, there could be several grid generated.
        *           Therefore we should specify the one we want to populate,
        *           otherwise every generated grid will be populated
        *   contents: an array of content, each content is an object with a property 'content' that can be passed as html string or as any focus-generated element
        *             while the 'positionInNodeList' poperty defines the position of the content within the item children
        */
    this.populate = function (params) {
        if (params.grid) {
            try {
                Array.prototype.forEach.call(params.grid.gridItems, function (gridItem, index) {
                    if (index === params.contents.length) {
                        throw ''
                    } 
                    gridItem.addContent(params.contents[index])
                })
            } catch(e){
                e !== '' ? console.error('ERROR: ', e) : ''
            }
                
        } else {
            this.generated().forEach(function (grid) {
                try {
                    Array.prototype.forEach.call(grid.gridItems, function (gridItem, index) {
                        if (index === params.contents.length) {
                            throw ''
                        } 
                        gridItem.addContent(params.contents[index])
                    })
                } catch(e){
                    e !== '' ? console.error('ERROR: ', e) : ''
                } 
            })
        }
    }
    /**
        * Removes specified item from the grid
        * @param {Object} - params 
        *   from: the grid to remove the item from, since the Grid constructor generates a grid per parent, there could be several grid generated.
        *       Therefore we should specify the one we want to remove the item from,
        *       otherwise the item will be removed from every generated grid
        *
        *   positionInNodeList: the position of the item to remove withing the other items in the grid
        */
    this.removeItem = function (params) {
        var toRemove
        var self = this
        if (params.from) {
            params.from.element.children[params.positionInNodeList].remove()
        } else {
            this.generated().forEach(function(grid) {
                grid.element.children[params.positionInNodeList].remove()
            })
        }
        // this.updateGridItemIndexes()
    }
    /**
        * builds the html of a grid item
        * @param {Object} gridItemObj  
        *   width: the width of the item (passed as css value), if not specified the grid item will wrap its content
        *   height: the height of the item (passed as css value), if not specified whereas width is specified the height will be equal to the width
        *           otherwise the grid item will wrap its content
        *   content: the content of the gridItem, can be passed as html string or as any focus-generated element
        * @param {Number} index - the position of the gridItem within its siblings
        * @param {String} gridOfBelonging - the hash of the grid the gridItem belongs to
        * @return {String} - the item to be generated html
        */
    this.buildItem = function (gridItemObj, index, gridOfBelonging) {
        var content
        if(typeof gridItemObj.content === 'object') {
            content = gridItemObj.content.generated()[0].element.outerHTML
            gridItemObj.content.generated()[0].element.remove()
        } else {
            content = gridItemObj.content
        }
        return '<div class= "gridItem" id =' + gridItemObj.id + ' data-index= ' + index + ' data-hash=' + focus.generateHash() + ' data-gridOfBelonging=' + gridOfBelonging + ' style= "width:' + gridItemObj.width + '; height:' + (gridItemObj.height || gridItemObj.width)+'";">'+(content||'')+'</div>'
    }
    var generated = this.generate(parentEl, obj)
    /**
        *   Gets the Grid updated data
        */
    this.generated = function () {
        var toReturn = []
        generated.forEach(function(generatedEl){
            toReturn.push(focus.elDataArray.filter(function(elData){
                return elData.hash == generatedEl.hash
            })[0])
        })
        //generatedEl is just for debug, don't base anything on it
        self.generatedEl = toReturn
        return toReturn
    }

    /**
        *   updates gridItems indexes
        */
    this.updateGridItemIndexes = function () {
        this.generated().forEach(function (generatedGrid) {
            Array.prototype.forEach.call(generatedGrid.gridItems, function(gridItem, index) {
                gridItem.dataset.index = index
            })
        })
    }
}

Grid.prototype = focus
module.exports = Grid
},{"../focus.js":2}],2:[function(require,module,exports){
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

module.exports = focus
},{}],3:[function(require,module,exports){
var Grid = require('../components/Grid/Grid')

describe('Grid Object default generation', () => {
	beforeEach(() => {
  	document.body.innerHTML = '<div id="div1"></div><span id="span1"></span><div id="div2"><span class="subspan"></span><span class="subspan"></span></div>'
	})

  it('should generate a Grid in the elements matching the passed selector', () => {
  	new Grid('#div2 .subspan', {})
  	const generatedElements = document.querySelectorAll('#div2 .subspan .basic_grid')
  	expect(generatedElements.length).to.equal(document.querySelectorAll('#div2 .subspan').length)
  })

  it('should generate a Grid in the body if no selector passed', () => {
  	new Grid('', {})
  	expect(document.querySelector('body > .basic_grid')).to.exist
  })

  it('should add the passed classes to the Grid', () => {
  	const classes = (() => {
  		const arr = []
  		const length = Math.floor(Math.random() * 10)
  		for (let i = 0; i < length; i++) {
  			arr.push('class'+i)
  		}
  		return arr
  	})()
  	new Grid('', {
  		class: classes
  	})
  	const generatedElementClassList = Array.prototype.join.call(document.querySelector('.basic_grid').classList, '')
  	expect(generatedElementClassList).to.equal(classes.join(''))
  })

  it('should generate the amount of gridItem as the nbItems property', () => {
  	const nbItems = (() => {
			return Math.floor(Math.random() * 10)
		})()
  	new Grid('', {
  		nbItems: nbItems
  	})
  	expect(document.querySelectorAll('.basic_grid > .gridItem').length).to.equal(nbItems)
  })

  it('should set all items to the size of itemWidth and itemHeight', () => {
  	const width = (() => {
  		return Math.floor(Math.random() * 400) + 'px'
  	})()
  	const height = (() => {
  		return Math.floor(Math.random() * 400) + 'px'
  	})()
  	new Grid('', {
  		itemHeight: height,
  		itemWidth: width,
  		nbItems: 5
  	})
  	Array.prototype.forEach.call(document.querySelectorAll('.gridItem'), (gridItem) => {
  		expect(gridItem.style.width).to.equal(width)
  		expect(gridItem.style.height).to.equal(height)
  	})
  })

  it('should set heights to width size if heights not specified', () => {
  	const width = (() => {
  		return Math.floor(Math.random() * 400) + 'px'
  	})()
  	new Grid('', {
  		itemWidth: width,
  		nbItems: 5
  	})
  	Array.prototype.forEach.call(document.querySelectorAll('.gridItem'), (gridItem) => {
  		expect(gridItem.style.width).to.equal(width)
  		expect(gridItem.style.height).to.equal(width)
  	})
  })

})

},{"../components/Grid/Grid":1}]},{},[3]);
