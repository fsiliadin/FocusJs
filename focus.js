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
			return (Math.floor(Math.pow(2,32))*Math.random()+1)/(Math.floor(1000)*Math.random()+1)*Math.exp((Math.floor(10)*Math.random()+1));
		},
		// this function delegates the programmers events to the body, so that he doesn't have to rebind them after render 
		bindEvent: function (el, events) {
			var eventsImplemented =  Object.keys(events);
			eventsImplemented.forEach(function(type){
				document.querySelectorAll('body')[0].addEventListener(type, function(event) {
					if (event.target.dataset.hash===el+'') {
						events[type](event);
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
			} catch (e) {
				console.debug (e.message);
			}
		},

		render : function render(){

		}
	}

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
			var hash;
			// for each node el taken in account is generated an html
			Array.prototype.forEach.call(container, function(item, index){
				descriptor.class.push('basic_button');
				classes = descriptor.class.join(' ');
				// creation of a hash to identify each element
				hash = self.generateHash();
				self.hash = hash;
				html = '<div id="'+descriptor.id+'" class ="'+classes+'" data-hash="'+hash+'">'+descriptor.text+'</div>';
				self.__proto__.generate(html, item, positionInNodeList);
				if(typeof descriptor.events !== 'undefined') {
					self.__proto__.bindEvent(hash, descriptor.events);
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
			var hash;
			Array.prototype.forEach.call(container, function(item, index){
				descriptor.class.push('basic_banner');
				classes = descriptor.class.join(' ');
				hash = self.generateHash();
				self.hash = hash;
				html =  '<div><div class = "shadow-top" style = "height:4px"></div><div id="'+descriptor.id+'" class ="'+classes+'" data-hash="'+hash+'""></div><div class = "shadow-bottom" style = "height:15px"></div>';

				self.__proto__.generate(html, item, positionInNodeList);
				if(typeof descriptor.events !== 'undefined') {
					self.__proto__.bindEvent(hash, descriptor.events);
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
			var hash;
			Array.prototype.forEach.call(container, function(item, index){
				descriptor.class.push('basic_accordion');
				classes = descriptor.class.join(' ');
				hash = self.generateHash();
				self.hash = hash;
				html = '<table class = "'+classes+'" data-hash="'+hash+'" id ="'+descriptor.id+'"style = "height:'+descriptor.height+'"><tr>';
				for (var i = 0; i < descriptor.nbCols; i++) {
					console.log('i', i);
					if (i === descriptor.nbCols - 1) {
						i = 'Last';
					}
					html += '<td class ="td'+i+'">bldsfdsqfdsfdsqfqfqqddfdsqfdsfdsqfqsdfaedsfdqa</td>';
				}
				html += '</tr></table>';
				self.__proto__.generate(html, item, positionInNodeList);
				if(typeof descriptor.events !== 'undefined') {
					self.__proto__.bindEvent(hash, descriptor.events);
				}
			});
		}
		this.generate(parentEl, obj);
	}

	function ImageTextZone(parentEl, obj, positionInNodeList){
		parentEl = this.checkParent(parentEl);

	}

	function Footer(parentEl, obj, positionInNodeList){
		parentEl = this.checkParent(parentEl);

	}

	function Menu(parentEl, obj, positionInNodeList){
		parentEl = this.checkParent(parentEl);

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
			var hash;
			Array.prototype.forEach.call(container, function(item, index){
				descriptor.class.push('basic_grid');
				classes = descriptor.class.join(' ');
				hash = self.generateHash();
				self.hash = hash;
				var L = descriptor.itemWidth;
				var l = descriptor.itemHeight ? descriptor.itemHeight : L;
				html = '<div id ="'+descriptor.id+'" class="'+classes+'" data-hash="'+hash+'">'
				for (var i = 0; i < descriptor.nbItems; i++) {
					html += '<div class= "gridItem" style= "width:'+L+'; height:'+l+';"></div>';
				}
				html += '</div>';
				console.log('html: ', html);
				console.log('item: ', item);
				console.log('position', positionInNodeList);
				self.__proto__.generate(html, item, positionInNodeList);
				if(typeof descriptor.events !== 'undefined') {
					self.__proto__.bindEvent(hash, descriptor.events);
				}
			});
		}
		this.generate(parentEl, obj);
	}



	Button.prototype = focus;
	Banner.prototype = focus;
	ImageTextZone.prototype = focus;
	Footer.prototype = focus;
	Menu.prototype = focus;
	Grid.prototype = focus;
	Accordion.prototype = focus;