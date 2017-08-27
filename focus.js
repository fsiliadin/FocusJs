    // focus, the root object that all basic component inherit
    // it defines generic methods 
    var focus = {
        generate : function generate(htmlStr, parentEl, positionInNodeList) {
            var siblings = parentEl.children;
            // if the programmer doesn't specify any position by default the position is the last
            if (typeof positionInNodeList === 'undefined' || positionInNodeList > siblings.length - 1) {
                if (siblings.length) {
                    siblings[siblings.length - 1].insertAdjacentHTML("afterend", htmlStr);
                } else {
                    parentEl.innerHTML += htmlStr;
                }
                return parentEl.lastChild;
            } else {
                siblings[positionInNodeList].insertAdjacentHTML("beforebegin", htmlStr);
                return parentEl.children[positionInNodeList];
            }
        },
        remove: function remove (parentEl, positionInNodeList) {
           return parentEl.removeChild(parentEl.children[positionInNodeList]);
        },
        // generates a unique hash that is assigned to the created element
        generateHash: function generateHash(){
            return (Math.pow(2,32)*Math.random()+1)/(1000*Math.random()+1)*Math.exp(10*Math.random()+1);
        },
        // this function delegates the programmers events to the body, so that he doesn't have to rebind them after render 
        bindEvent: function bindEvent(el, events) {
            events.forEach(function(event){
                document.querySelectorAll('body')[0].addEventListener(event.type, function(e) {
                    if (e.target.dataset.hash===el+'') {
                        event.handler(e);
                    }
                }, false);
            });
        },
        // check if the element containing the element to be created exists
        checkParent: function checkParent(parentSelector) {
            try {
                if (parentSelector == false) {
                    parentEl = document.querySelectorAll('body');
                } else {
                    parentEl = document.querySelectorAll(parentSelector);
                }
                return parentEl;
            } catch (error) {
                console.error (error.message);
            }
        },

        render: function render(){

        },

        hasClass: function hasClass(element, _class) {
            return Array.prototype.indexOf.call(element.classList, _class) > -1;
        },

        removeClass: function removeClass (element, _class) {
            element.className = element.className.replace(_class, '');
            // we return focus so that we can chain function call
            return this;
        },

        addClass: function addClass (element, _class) {
            // _class could be an array of classes
            element.className += ' '+_class.toString();
        },
        removeUnity: function removeUnity (str) {
            var strArr = str.split('');
            strArr.splice(strArr.length - 2, 2);
            return strArr.join('') | 0;
        },

        // this function returns the position of an element relative to the specified area
        // the element shall exist in that area
        getPositionInArea: function getPositionInArea(el, area) {
            var pos = {
                top : 0,
                left : 0
            }
            function getPosition(el){
                pos.top += el.offsetTop;
                pos.left += el.offsetLeft;
                if(el.parentElement !== area){
                     getPosition(el.parentElement);
                }
                return pos;
            }
            return getPosition(el);
        },

        smoothScrollBy:  function smoothScrollBy (area, scrollDistances) {
            var animation, previousScrollPos = {
                top: area.scrollTop,
                left: area.scrollLeft
            };
            var finalPositions = {
                top: area.scrollTop + scrollDistances.top,
                left: area.scrollLeft + scrollDistances.left
            }
            var increment= {
                top: 0,
                left: 0
            };
            var cumul={
                top:0,
                left:0
            };
            animation = setInterval(function(){
                // manage to scroll
                increment.top = (scrollDistances.top - cumul.top)*0.3 ;                
                increment.left = (scrollDistances.left - area.scrollLeft)*0.3 ;

                area.scrollTop += Math.abs(increment.top) < 1 ? Math.abs(increment.top)/increment.top  : increment.top;
                area.scrollLeft += Math.abs(increment.left) < 1 ? Math.abs(increment.left)/increment.left  : increment.left;
                cumul.top += increment.top;
                cumul.left += increment.left;
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
                    clearInterval(animation);
                }
                previousScrollPos.top = area.scrollTop;
                previousScrollPos.left = area.scrollLeft;
            },100)
        }
    } //focus

    function Button(parentSelector, obj, positionInNodeList){
        // function that creates the html of the button
        this.generate = function (container, descriptor) {
            var html= '';
            var classes= '';
            var res = [], ret;
            // if the programmer specifies an id, only the first node el is taken in account
            // can't have several object with the same id
            if(typeof descriptor.id !== 'undefined') {
                container = [container[0]];
            }
            if (!(descriptor.class instanceof Array)) {
                descriptor.class = []
            }
            var self = this;
            // for each node el taken in account is generated an html
            Array.prototype.forEach.call(container, function(item, index){
                descriptor.class.indexOf('basic_button') === -1 ? descriptor.class.push('basic_button'): '';
                classes = descriptor.class.join(' ');
                // creation of a hash to identify each element
                var hash = self.generateHash();
                html = '<div id="'+descriptor.id+'" class ="'+classes+'" data-hash="'+hash+'">'+descriptor.text+'</div>';
                ret = self.__proto__.generate(html, item, positionInNodeList);
                res.push({
                    hash: hash,
                    element: ret,
                    container: item
                });
                if(typeof descriptor.events !== 'undefined') {
                    self.bindEvent(hash, descriptor.events);
                }
            });
            return res;
        };

        var parentEl = this.checkParent(parentSelector);
        this.generated = this.generate(parentEl, obj);
    }

    function Banner(parentSelector, obj, positionInNodeList){
        var parentEl = this.checkParent(parentSelector);
        this.generate = function (container, descriptor) {
            var html = '';
            var classes = ''; 
            // if the element to be create has an id so we only create one in the first matchin component
            if(typeof descriptor.id !== 'undefined') {
                container = [container[0]];
            }
            if (!(descriptor.class instanceof Array)) {
                descriptor.class = []
            }
            var self = this;
            Array.prototype.forEach.call(container, function(item, index){
                descriptor.class.indexOf('basic_banner') === -1 ? descriptor.class.push('basic_banner'): '';
                classes = descriptor.class.join(' ');
                self.hash = self.generateHash();
                html =  '<div><div class = "shadow-top" style = "height:4px"></div><div id="'+descriptor.id+'" class ="'+classes+'" data-hash="'+self.hash+'""></div><div class = "shadow-bottom" style = "height:15px"></div>';

                self.__proto__.generate(html, item, positionInNodeList);
                if(typeof descriptor.events !== 'undefined') {
                    self.bindEvent(self.hash, descriptor.events);
                }

            });
        }       
        this.generate(parentEl, obj);
    }



    function Accordion (parentSelector, obj, positionInNodeList){
        var parentEl = this.checkParent(parentSelector);
        this.generate = function (container, descriptor) {
            var html = '';
            var classes = '';
            if (typeof descriptor.id !== 'undefined') {
                container = [container[0]];
            }
            if (!(descriptor.class instanceof Array)) {
                descriptor.class = []
            }
            var self = this;

            Array.prototype.forEach.call(container, function(item, index){
                descriptor.class.indexOf('basic_accordion') === -1 ? descriptor.class.push('basic_accordion'):'';
                classes = descriptor.class.join(' ');
                self.hash = self.generateHash();
                html = '<table class = "'+classes+'" data-hash="'+self.hash+'" id ="'+descriptor.id+'"style = "height:'+descriptor.height+'"><tr>';
                for (var i = 0; i < descriptor.nbCols; i++) {
                    if (i === descriptor.nbCols - 1) {
                        i = 'Last';
                    }
                    html += '<td class ="accordionItem"><div class="accordionPlaceholder">'+descriptor.placeholderUnactive+'</div><div class= "accordionContent" >'+descriptor.activeContent+'</div></td>';
                }
                html += '</tr></table>';
                self.__proto__.generate(html, item, positionInNodeList);
                if(typeof descriptor.events !== 'undefined') {
                    self.bindEvent(self.hash, descriptor.events);
                }
            });
        }

        this.generate(parentEl, obj);
    }

    /**
    * Generates a Grid
    * @constructor
    * @param {String} parentSelector - the selector that will determine the container(s) of the grid(s)
    * @param {Object} obj - the grid descriptor
    * @param {Number} positionInNodeList - the position of the grid between its siblings
    */
    function Grid(parentSelector, obj, positionInNodeList){
        var parentEl = this.checkParent(parentSelector);
        /**
        * Generates grid html and insert it in the proper container in the DOM
        * @param {NodeList} container - contains element grids will be generated in one grid per element
        * @param {Object} descriptor - the grid descriptor
        * @return {Array} an array of grid data:
        *   hash: the hash of the generated grid
        *   element: the grid element as it is in the DOM
        *   gridItems: a NodeList of the grid items   
        *   container: the parent element of each generated grid
        */
        this.generate = function (container, descriptor) {
            var html = '';
            var classes  = '';
            var res = [], ret;
            if (typeof descriptor.id !== 'undefined') {
                container = [container[0]];
            }
            if (!(descriptor.class instanceof Array)) {
                descriptor.class = []
            }
            var self = this;
            Array.prototype.forEach.call(container, function (item, index){
                descriptor.class.indexOf('basic_grid') === -1 ? descriptor.class.push('basic_grid'):'';
                classes = descriptor.class.join(' ');
                var hash = self.generateHash();
                var L = descriptor.itemWidth;
                var l = descriptor.itemHeight ? descriptor.itemHeight : L;
                html = '<div id ="'+descriptor.id+'" class="'+classes+'" data-hash="'+hash+'" data-gridindex="'+index+'">'
                if (!('contents' in descriptor)) {
                    for (var i = 0; i < descriptor.nbItems; i++) {
                        html += self.buildItem({
                            width: descriptor.itemWidth, 
                            height: descriptor.itemHeight
                        });
                    }
                } else {
                    descriptor.contents.forEach(function (content) {
                        html += self.buildItem(content);
                    })
                }
                
                html += '</div>';
                ret = self.__proto__.generate(html, item, positionInNodeList);
                Array.prototype.forEach.call(ret.children, function (child){
                    self.addGridItemMethods(child);
                });
                res.push({
                    hash: hash,
                    element: ret,
                    gridItems: ret.children,
                    container: item
                });
                if(typeof descriptor.events !== 'undefined') {
                    self.bindEvent(hash, descriptor.events);
                }
            });
            return res;
        }

        /**
        * Attach methods to grid items
        * @param {DOM Element} - the grid item element
        *
        */
        this.addGridItemMethods = function (gridItem) {
            var self = this;
            gridItem.addContent = function(obj) {
                if(typeof obj.content === 'object') {
                    obj.content = obj.content.generated[0].element.outerHTML;
                }
                self.__proto__.generate(obj.content, this, obj.positionInNodeList);
            };
            gridItem.clearContent = function() {
                this.innerHTML = '';
            };
            gridItem.modify = function(dimensions) {
                this.style.height = dimensions.height;
                this.style.width =  dimensions.width;
            };
        }
        /**
        * Add specified item to the grid
        * @param {Object} - params 
        *   to: the grid to add the item to, since the Grid constructor generates a grid per parent, there could be several grid generated.
        *       Therefore we should specify the one we want to add the item to,
        *       otherwise the item will be added to every generated grid
        *
        *   positionInNodeList: the position of the item withing the other items in the grid
        */
        this.addItem = function (params) {
            var itemHtml = this.buildItem(params);
            var self = this;         
            if (params.to) {
                this.addGridItemMethods(this.__proto__.generate(itemHtml, params.to.element, params.positionInNodeList));
            } else {
               this.generated.forEach(function (grid) {
                    self.addGridItemMethods(self.__proto__.generate(itemHtml, grid.element, params.positionInNodeList));
               });
            }
        }

        /**
        * populate a grid with an array of contents
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
                        gridItem.addContent(params.contents[index]);
                    });
                } catch(e){}
                
            } else {
                this.generated.forEach(function (grid) {
                    try {
                        Array.prototype.forEach.call(grid.gridItems, function (gridItem, index) {
                            if (index === params.contents.length) {
                                throw ''
                            } 
                            gridItem.addContent(params.contents[index]);
                        });
                    } catch(e){} 
                });
            }
        }
        /**
        * Remove specified item from the grid
        * @param {Object} - params 
        *   from: the grid to remove the item from, since the Grid constructor generates a grid per parent, there could be several grid generated.
        *       Therefore we should specify the one we want to remove the item from,
        *       otherwise the item will be removed from every generated grid
        *
        *   positionInNodeList: the position of the item to remove withing the other items in the grid
        */
        this.removeItem = function (params) {
            var toRemove;
            var self = this;
            if (params.from) {
                this.remove(params.from.element, params.positionInNodeList);
            } else {
                this.generated.forEach(function(grid) {
                    self.remove(grid.element, params.positionInNodeList);
                });
            }
        }
        /**
        * build the html of a grid item
        * @param {Object} - params 
        *   width: the width of the item (passed as css value), if not specified the grid item will wrap its content
        *   height: the height of the item (passed as css value), if not specified whereas width is specified the height will be equal to the width
        *           otherwise the grid item will wrap its content
        *   content: the content of the gridItem, can be passed as html string or as any focus-generated element
        *
        * @return {String} - the item to be generated html
        */
        this.buildItem = function (gridItem) {
            if(typeof gridItem.content === 'object') {
                gridItem.content = gridItem.content.generated[0].element.outerHTML;
            }
            return '<div class= "gridItem" style= "width:' + gridItem.width +'; height:'+(gridItem.height || gridItem.width)+'";">'+(gridItem.content||"")+'</div>';
        }
        this.generated = this.generate(parentEl, obj);
    }


    function ImageTextZone(parentSelector, obj, positionInNodeList){
        var parentEl = this.checkParent(parentSelector);
        this.generate = function (container, descriptor) {
            var html = '';
            var classes = '';
            if (typeof descriptor.id !== 'undefined') {
                container = [container[0]];
            }
            if (!(descriptor.class instanceof Array)) {
                descriptor.class = []
            }
            var self = this;
            Array.prototype.forEach.call(container, function(item, index){
                descriptor.class.indexOf('basic_imageTextZone') === -1 ? descriptor.class.push('basic_imageTextZone'):'';
                classes = descriptor.class.join(' ');
                self.hash = self.generateHash();
                html = '<table class= "'+classes+'" data-hash="'+self.hash+'" id ="'+descriptor.id+'"><tr>';
                if(descriptor.imageAfter) {
                    html += '<td class ="text">'+descriptor.text+'</td>';
                    html += '<td class ="image" ><img class ="bli" src="'+descriptor.url+'" alt= "'+descriptor.alt+'" style ="width:'+descriptor.imageWidth+'; height:'+descriptor.imageHeight+';"></td>';
                } else {
                    html += '<td class ="image" ><img class ="bli" src="'+descriptor.url+'" alt= "'+descriptor.alt+'" style ="width:'+descriptor.imageWidth+'; height:'+descriptor.imageHeight+';"></td>';
                    html += '<td class ="text" >'+descriptor.text+'</td>';
                }
                html += '</tr></table>';
                self.__proto__.generate(html, item, positionInNodeList);
                if(typeof descriptor.events !== 'undefined') {
                    self.__proto__.bindEvent(self.hash, descriptor.events);
                }
            });
        }
        this.generate(parentEl, obj);
    }

    function Slider (parentSelector, obj, positionInNodeList) {
        var parentEl = this.checkParent(parentSelector);
    }

    function Footer(parentSelector, obj, positionInNodeList){
        var parentEl = this.checkParent(parentSelector);

    }

    function Menu(parentSelector, obj, positionInNodeList){
        //can be selectMenu too
        var parentEl = this.checkParent(parentSelector);

    }

    function Popup(parentSelector, obj) {
        var parentEl = this.checkParent(parentSelector);
    }


    function Scroller (parentSelector, obj) {
        var positionInNodeList = 0;
        var parentEl = this.checkParent(parentSelector);
        var self = this;
        this.generate = function (container, descriptor) {
            var html = '';
            var classes = '';
            if (!(descriptor.class instanceof Array)) {
                descriptor.class = []
            }
            Array.prototype.forEach.call(container, function (item, index) {
                descriptor.class.indexOf('basic_scroller') === -1 ? descriptor.class.push('basic_scroller'):'';
                descriptor.class.indexOf('goingDown') === -1 ? descriptor.class.push('goingDown'):'';
                classes = descriptor.class.join(' ');
                self.hash = self.generateHash();
                html = '<img src="images/scroller_arrow_down.png" alt="scroller_arrow" data-area='+index+' class="'+classes+'" data-hash="'+self.hash+'">';
                var generatedEl = self.__proto__.generate(html, item, positionInNodeList);
                if(typeof descriptor.events !== 'undefined'){
                    self.__proto__.bindEvent(self.hash, descriptor.events);
                }
                generatedEl.style.top = (item.tagName === 'BODY' ? document.documentElement.clientHeight : focus.removeUnity(item.style.height)) - 50 + 'px';              

            });
        };

        /**
        * Gets the DOM elements corresponding to the targets in scrollArea and calculate their top position
        * relative to the scrollArea scrollTop.
        * @param {DOM Element} scrollArea.
        * @return {Object[]} targetsEls - the targets in the scrollArea sorted by position.
        * @return {Number} targetsEls.pos - the position of the target relative to scrollArea scrollTop.
        * @return {DOM Element} targetsEls.el - the DOM Element corresponding to the target.
        */
        this.getTargets = function getTargets (scrollArea) {
                var targetsInScrollArea, targetEls= [];
                obj.targets.forEach(function(targetSelector){   //for each target selector in the target array 
                    // we get the matching target elements in the scroll area 
                    targetsInScrollArea = scrollArea.querySelectorAll(parentSelector+' '+targetSelector);
                    // then we put all targets together in the same array
                    targetEls = targetEls.concat(Array.prototype.slice.call(targetsInScrollArea));                  
                });
                return targetEls.map(function (target){
                    return {
                        el: target,
                        pos: focus.getPositionInArea(target, scrollArea).top - scrollArea.scrollTop
                    }
                }).sort(function(a, b){
                    return a.pos - b.pos;
                });
        };

        /**
        * Calculates the absolute top position of each target in the scrollArea. 
        * @param {DOM Element} scrollArea.
        * @return {Array} a sorted array of the absolute position top of all targets in scrollArea.
        */
        this.getTargetsAbsolutePos =  function getTargetsAbsolutePos (scrollArea) {
            var targetsInScrollArea, targetEls= [];
            // for each target selector in the obj.targets array 
            obj.targets.forEach(function(targetSelector){   
                // we get the matching target elements in the scroll area 
                targetsInScrollArea = scrollArea.querySelectorAll(parentSelector+' '+targetSelector);
                // then we put all targets together in the same array
                targetEls = targetEls.concat(Array.prototype.slice.call(targetsInScrollArea));                  
            });
            // for each target element, we calculate it's absolute position in the scrollArea
            // that we return as a sorted array of numbers
            return targetEls.map(function (target){
                return focus.getPositionInArea(target, scrollArea).top;
            }).sort(function(a, b){
                return a - b;
            });
        };

        if (!(obj.events instanceof Array)){
            obj.events = [];
        }
        // Push a click event in the events array
        obj.events.push({
            type: 'click',
            handler: 
            // On click we scroll to the nearest target according the direction of the scroller 
            function(e) {
                var distanceToNextTarget = 0;
                // Here we determine the targets to go on click, according the targets array the user provides as selectors in obj.targets
                // we define the area to browse according the scroller that is clicked
                var scrollArea = parentEl[e.target.dataset.area];
                // then we get the relative position of the targets
                var targetRelativePosition = self.getTargets(scrollArea).filter(function(target){
                    // whether we are moving down or moving up we look to the target above or under the current scroll position
                    if(focus.hasClass(e.target, 'goingUp')){
                        return target.pos < 0; 
                    } else {
                        return target.pos > 0;
                    }
                });

                console.log('targets pos ', targetRelativePosition);
                // if there is no targets to go, we return
                if (targetRelativePosition.length === 0) {
                    return;
                }
                // we are going up
                if (targetRelativePosition[0].pos < 0) {
                    distanceToNextTarget = targetRelativePosition[targetRelativePosition.length - 1].pos;
                } else if (targetRelativePosition[0].pos > 0) {
                    distanceToNextTarget = targetRelativePosition[0].pos;
                }
                // scroll the scrollArea
                focus.smoothScrollBy(scrollArea, {
                    top: distanceToNextTarget,
                    left: 0
                });
            }
        });

        // on scroll of 
        Array.prototype.forEach.call(parentEl, function(scrollArea) {
            var previousScrollPos = {top:0}, scroller, highest, lowest, targets;
            scrollArea.addEventListener('scroll', function () {
                scroller = this.querySelector('.basic_scroller');
                targets = self.getTargetsAbsolutePos(scrollArea);
                highest = targets[0];
                lowest = targets[targets.length - 1];
                if (this.scrollTop > previousScrollPos.top) {
                    focus.hasClass(scroller, 'goingDown') ? '' : focus.removeClass(scroller, 'goingUp').addClass(scroller, 'goingDown'); 
                } else if (this.scrollTop < previousScrollPos.top) {
                    focus.hasClass(scroller, 'goingUp') ? '' : focus.removeClass(scroller, 'goingDown').addClass(scroller, 'goingUp'); 
                }
                if (this.scrollTop <= highest || this.scrollTop === 0) {
                    focus.hasClass(scroller, 'goingDown') ? '' : focus.removeClass(scroller, 'goingUp').addClass(scroller, 'goingDown'); 
                }
                if (this.scrollHeight === this.scrollTop + this.clientHeight || this.scrollTop >= lowest){
                    focus.hasClass(scroller, 'goingUp') ? '' : focus.removeClass(scroller, 'goingDown').addClass(scroller, 'goingUp'); 
                }
                scroller.style.top =   focus.removeUnity(this.style.height) - 50 + this.scrollTop + 'px';
                previousScrollPos.top = this.scrollTop;
            });
        });

        // deal with left one day
        var previousScrollPos= {top:0} 
        // Scrolling window
        window.onscroll = function(){
            var scroller = document.querySelector('body .basic_scroller');
            var scrollArea = document.querySelector('body');
            var targets = self.getTargetsAbsolutePos(scrollArea);
            var highest = targets[0];
            var lowest = targets[targets.length - 1];

            if (this.scrollY > previousScrollPos.top ) {
                focus.hasClass(scroller, 'goingDown') ? '' : focus.removeClass(scroller, 'goingUp').addClass(scroller, 'goingDown'); 
            } else if (this.scrollY < previousScrollPos.top ) {
                focus.hasClass(scroller, 'goingUp') ? '' : focus.removeClass(scroller, 'goingDown').addClass(scroller, 'goingUp'); 
            }
            if (this.scrollY <= highest || this.scrollY === 0) {
                focus.hasClass(scroller, 'goingDown') ? '' : focus.removeClass(scroller, 'goingUp').addClass(scroller, 'goingDown'); 
            }
            if (document.documentElement.scrollHeight === this.scrollY + document.documentElement.clientHeight || this.scrollY >= lowest){
                focus.hasClass(scroller, 'goingUp') ? '' : focus.removeClass(scroller, 'goingDown').addClass(scroller, 'goingUp'); 
            }
            scroller.style.top = focus.removeUnity(scroller.style.top) + (this.scrollY - previousScrollPos.top) + 'px';
            previousScrollPos.top = this.scrollY;
        }        

        this.generate(parentEl, obj);
    }

    /**
    * Generates one or many RateSliders
    * @constructor
    * @param {String} parentSelector - the selector that will determine the container(s) of the slider(s)
    * @param {Object} obj - the slider descriptor
    * @param {Number} positionInNodeList - the position of the slider between its siblings
    */

    function RateSlider (parentSelector, obj, positionInNodeList) {
        var parentEl = this.checkParent(parentSelector);
        var self = this;
        if (!(obj.events instanceof Array)){
            obj.events = [];
        }
        obj.events.push({
            type: 'mouseout',
            handler: 
            function (e) {
                self.fill(self.generated[e.target.dataset.index].rate, e.target.children);
            }
        });

        /**
        * Generates rateslider html and insert it in the proper container in the DOM
        * @param {NodeList} container - contains element rateslider will be generated in, one rateslider per element
        * @param {Object} descriptor - the rateslider descriptor:
        *   maxRate: the maximum rate on the rateslider, as a number
        *   initialValue: initial value of the rateslider, as a number
        *   readOnly: if we don't want ui to set rateslider value, readOnly should be set true. Default value is false
        *   pattern: the pattern of the rateslider (star, dollars...) can be passed as a string or as an unicode utf-8 value. default value is: &#9733
        *   activeColor: the color of the active items. Default value is : rgb(255, 221, 153) 
        * @return {Array} an array of rateslider data:
        *   hash: the hash of the generated rateslider
        *   element: the rateslider element as it is in the DOM
        *   rate: the value of the rateslider as a number   
        *   container: the parent element the generated rateslider
        */
        this.generate = function (container, descriptor) {
            var html = '';
            var classes = '';
            if (!(descriptor.class instanceof Array)) {
                descriptor.class = []
            }
            var res = [];
            Array.prototype.forEach.call(container, function (item, index) {
                descriptor.class.indexOf('basic_rateSlider') === -1 ? descriptor.class.push('basic_rateSlider'):'';
                classes = descriptor.class.join(' ');
                var hash = self.generateHash();
                html = '<div class="' + classes + '" data-hash=' + hash + ' data-index=' + index + '>';
                for (var i = 1; i <= descriptor.maxRate; i++) {
                    html += '<div class="rateItem" data-rate=' + i + '>' + (descriptor.pattern || "&#9733") + '</div>'
                }
                html += '</div>';
                var ret = self.__proto__.generate(html, item, positionInNodeList);
                if(typeof descriptor.events !== 'undefined') {
                    self.bindEvent(hash, descriptor.events);
                }
                self.fill(descriptor.initialValue, ret.children);
                if (!descriptor.readOnly) {
                    Array.prototype.forEach.call(ret.children, function (rateItem, id, siblings) {
                        rateItem.addEventListener('mouseenter', function (e) {
                            self.fill(e.target.dataset.rate, siblings);
                        });
                        rateItem.addEventListener('click', function (e) {
                            self.generated[index].rate = e.target.dataset.rate; 
                        });
                    });
                }
                
                res.push({
                    hash: hash,
                    element: ret,
                    container: item,
                    rate: descriptor.initialValue
                });
            });
            return res;
        }
        /**
        * Set the value of the specified rateslider
        * @param {Number} rate - the value to set
        * @param {Object} rateSlider - a rateSlider data object as it is returned in this.generated Array
        *                              if there is no rateSlider specified every element of this.generated will be set
        */
        this.setValue =  function (rate, rateSlider) {
            if (rateSlider) {
                rateSlider.rate = rate;
                this.fill(rate, rateSlider.element.children);
            } else {
                var self = this;
                this.generated.forEach(function (rateSlider) {
                    self.setValue(rate, rateSlider);
                })
            }
        }
        this.fill = function (rate, siblings) {
            for (var i=1; i<= rate; i++) {
                siblings[i - 1].style.color = obj.activeColor || "rgb(255, 221, 153)";
            }
            for(i; i<= obj.maxRate; i++) {
                siblings[i - 1].style.color = "rgb(190, 190, 190)"
            }
        }
        this.generated = this.generate(parentEl, obj);
    }

    Button.prototype = focus;
    Banner.prototype = focus;
    ImageTextZone.prototype = focus;
    Footer.prototype = focus;
    Menu.prototype = focus;
    Grid.prototype = focus;
    Accordion.prototype = focus;
    Popup.prototype = focus;
    Slider.prototype = focus;
    Scroller.prototype = focus;
    RateSlider.prototype = focus;