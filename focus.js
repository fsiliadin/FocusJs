	// focus, the root object that all basic component inherit
	// it defines generic methods 
	var focus = {
		generate : function generate(htmlStr, parentEl, positionInNodeList) {
			var siblings = parentEl.children;
			// if the programmer doesn't specify any position by default the position is the last
			if (typeof positionInNodeList === 'undefined' || positionInNodeList > siblings.length - 1) {
				parentEl.innerHTML += htmlStr;
			} else {
				siblings[positionInNodeList].insertAdjacentHTML("beforebegin", htmlStr);
			}
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
		checkParent: function checkParent(parentEl) {
			try {
				if (parentEl == false) {
					parentEl = document.querySelectorAll('body');
				} else {
					parentEl = document.querySelectorAll(parentEl);
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

		// this function returns the position of an element relative to the specified area
		// the element shall exist in that area
		getPositionInArea: function getPositionInArea(el, area) {
			var pos = {
				top : 0,
				left : 0
			}
			function getPosition(el){
				pos.top += el.offsetTop;
				pos.left += el.offestLeft;
				if(el.parentElement !== area){
					 getPosition(el.parentElement);
				}
				return pos;
			}
			return getPosition(el);
		},

		smoothScrollBy:  function smoothScrollBy (area, scrollDistances, duration) {
			var animation, previousScrollPos = {
				top: area.scrollTop,
				left: area.scrollLeft
			};
			var finalPositions = {
				top: area.scrollTop + scrollDistances.top,
				left: area.scrollLeft + scrollDistances.left
			}
			animation = setInterval(function(){
				// manage to scroll within the given duration		
				area.scrollTop += (100 * scrollDistances.top/duration) < 1 ? 1 : (100 * scrollDistances.top/duration);
				area.scrollLeft += 100 * scrollDistances.left/duration;
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

	function Button(parentEl, obj, positionInNodeList){
		// function that creates the html of the button
		this.generate = function (container, descriptor) {
			var html= '';
			var classes= '';
			// if the programmer specifies an id, only the first node el is taken in account
			// can't have several object with the same id
			if(typeof descriptor.id !== 'undefined') {
				container = [container[0]];
			}
			var self = this;
			// for each node el taken in account is generated an html
			Array.prototype.forEach.call(container, function(item, index){
				descriptor.class.indexOf('basic_button') === -1 ? descriptor.class.push('basic_button'): '';
				classes = descriptor.class.join(' ');
				// creation of a hash to identify each element
				self.hash = self.generateHash();
				html = '<div id="'+descriptor.id+'" class ="'+classes+'" data-hash="'+self.hash+'">'+descriptor.text+'</div>';
				self.__proto__.generate(html, item, positionInNodeList);
				if(typeof descriptor.events !== 'undefined') {
					self.bindEvent(self.hash, descriptor.events);
				}
			});
		};

		parentEl = this.checkParent(parentEl);
		this.generate(parentEl, obj);
	}

	function Banner(parentEl, obj, positionInNodeList){
		parentEl = this.checkParent(parentEl);
		this.generate = function (container, descriptor) {
			var html = '';
			var classes = ''; 
			// if the element to be create has an id so we only create one in the first matchin component
			if(typeof descriptor.id !== 'undefined') {
				container = [container[0]];
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



	function Accordion (parentEl, obj, positionInNodeList){
		parentEl = this.checkParent(parentEl);
		this.generate = function (container, descriptor) {
			var html = '';
			var classes = '';
			if (typeof descriptor.id !== 'undefined') {
				container = [container[0]];
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

	function Grid(parentEl, obj, positionInNodeList){
		parentEl = this.checkParent(parentEl);
		this.generate = function (container, descriptor) {
			var html = '';
			var classes  = '';
			if (typeof descriptor.id !== 'undefined') {
				container = [container[0]];
			}
			var self = this;
			Array.prototype.forEach.call(container, function(item, index){
				descriptor.class.indexOf('basic_grid') === -1 ? descriptor.class.push('basic_grid'):'';
				classes = descriptor.class.join(' ');
				self.hash = self.generateHash();
				var L = descriptor.itemWidth;
				var l = descriptor.itemHeight ? descriptor.itemHeight : L;
				html = '<div id ="'+descriptor.id+'" class="'+classes+'" data-hash="'+self.hash+'">'
				for (var i = 0; i < descriptor.nbItems; i++) {
					html += '<div class= "gridItem" style= "width:'+L+'; height:'+l+';"></div>';
				}
				html += '</div>';
				self.__proto__.generate(html, item, positionInNodeList);
				if(typeof descriptor.events !== 'undefined') {
					self.bindEvent(self.hash, descriptor.events);
				}
			});
		}
		this.generate(parentEl, obj);
	}


	function ImageTextZone(parentEl, obj, positionInNodeList){
		parentEl = this.checkParent(parentEl);
		this.generate = function (container, descriptor) {
			var html = '';
			var classes = '';
			if (typeof descriptor.id !== 'undefined') {
				container = [container[0]];
			}
			var self = this;
			Array.prototype.forEach.call(container, function(item, index){
				descriptor.class.indexOf('basic_imageTextZone') === -1 ? descriptor.class.push('basic_imageTextZone'):'';
				classes = descriptor.class.join(' ');
				self.hash = self.generateHash();
				html = '<table class= "'+classes+'" data-hash="'+self.hash+'" id ="'+descriptor.id+'"><tr>';
				if(descriptor.imageAfter) {
					html += '<td class ="text">'+descriptor.text+'</td>';
					html += '<td class ="image" ><img src="'+descriptor.url+'" alt= "'+descriptor.alt+'" style ="width:'+descriptor.imageWidth+'; height:'+descriptor.imageHeight+';"></td>';
				} else {
					html += '<td class ="image" ><img src="'+descriptor.url+'" alt= "'+descriptor.alt+'" style ="width:'+descriptor.imageWidth+'; height:'+descriptor.imageHeight+';"></td>';
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

	function Slider (parentEl, obj, positionInNodeList) {

	}

	function Footer(parentEl, obj, positionInNodeList){
		parentEl = this.checkParent(parentEl);

	}

	function Menu(parentEl, obj, positionInNodeList){
		//can be selectMenu too
		parentEl = this.checkParent(parentEl);

	}

	function Popup(parentEl, obj) {
		parentEl = this.checkParent(parentEl);
	}


	function Scroller (parentSelector, obj) {
		var parentEl = this.checkParent(parentSelector);


		this.generate = function (container, descriptor) {
			var html = '';
			var classes = '';
			if (typeof descriptor.id !== 'undefined') {
				container = [container[0]];
			}
			var self = this;
			Array.prototype.forEach.call(container, function (item, index) {
				descriptor.class.indexOf('basic_scroller') === -1 ? descriptor.class.push('basic_scroller'):'';
				descriptor.class.indexOf('goingDown') === -1 ? descriptor.class.push('goingDown'):'';
				classes = descriptor.class.join(' ');
				self.hash = self.generateHash();
				html = '<img src="images/scroller_arrow_down.png" alt="scroller_arrow" data-area='+index+' class="'+classes+'"data-hash="'+self.hash+'">';
				self.__proto__.generate(html, item);
				if(typeof descriptor.events !== 'undefined'){
					self.__proto__.bindEvent(self.hash, descriptor.events);
				}
			});
		}
		obj.events.push({
			type: 'click',
			handler: function(e) {
				var targetEls= [], distanceToNextTarget = 0;
				// Here we determine the targets to go on click, according the targets array the user provides
				// we define the area to browse according the scroller that is clicked
				var scrollArea = parentEl[e.target.dataset.area];
				var targetsInScrollArea; 
				obj.targets.forEach(function(targetSelector){	//for each target selector in the target array 
					// we get the matching target elements in the scroll area 
					targetsInScrollArea = scrollArea.querySelectorAll(parentSelector+' '+targetSelector);
					// then we put all targets together in the same array
					targetEls = targetEls.concat(Array.prototype.slice.call(targetsInScrollArea));					
				});
				//  we calculate the relative position of each target in order to determine the closest
				var targetRelativePosition = targetEls.map(function (target){
					return focus.getPositionInArea(target, scrollArea).top - scrollArea.scrollTop;
				}).filter(function(position){
					// whether we are moving down or moving up we look to the target above or under the current 
					// scroll position
					if(focus.hasClass(e.target, 'goingUp')){
						return position < 0; 
					} else {
						return position > 0;
					}
				});

				if (targetRelativePosition[0] < 0) {
					distanceToNextTarget = Math.max(...targetRelativePosition);
				} else if (targetRelativePosition[0] > 0) {
					distanceToNextTarget = Math.min(...targetRelativePosition);
				}
				focus.smoothScrollBy(scrollArea, {
					top: distanceToNextTarget,
					left: 0
				}, 1000);
			}
		})
		this.generate(parentEl, obj);
		
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