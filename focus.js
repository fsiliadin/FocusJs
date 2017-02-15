	// focus, the root object that all basic component inherit
	// it defines generic methods 
	var focus = {
		generate : function (htmlStr, parentEl, positionInNodeList) {
			var siblings = parentEl.children;
			// if the programmer doesn't specify any position by default the position is the last
			if (typeof positionInNodeList === 'undefined' || positionInNodeList >= siblings.length - 1) {
				parentEl.innerHTML += htmlStr;
			} else {
				siblings[positionInNodeList].insertAdjacentHTML("beforebegin", htmlStr);
			}
		},

		bindEvent: function () {

		},
		checkParent: function (parentEl) {
			try {
				if (typeof parentEl === 'undefined') {
					parentEl = document.querySelectorAll('body');
				} else {
					parentEl = document.querySelectorAll(parentEl);
				}
				return parentEl;
			} catch (e) {
				console.debug (e.message);
			}
		},

		render : function (){

		}
	}

	function Button(parentEl, obj, positionInNodeList){
		// function that creates the html of the button
		this.generate = function (container, descriptor) {
			var html= '';
			var classes= '';
			// if the programmer specifies an id, only the first node el is taken in account
			// can't have several object with the same id
			if(typeof descriptor.id !== "undefined") {
				container = [container[0]];
			}
			var self = this;
			// for each node el taken in account is generated an html
			Array.prototype.forEach.call(container, function(item, index){
				descriptor.class.push('basic_button');
				classes = descriptor.class.join(' ');
				html = '<div id="'+descriptor.id+'" class ="'+classes+'" >'+descriptor.text+'</div>';
				self.__proto__.generate(html, item, positionInNodeList);
				if(typeof descriptor.events !== undefined) {
					self.__proto__.bindEvent(item, descriptor.events);
				}
			});
		};

		parentEl = this.checkParent(parentEl);
		this.generate(parentEl, obj);
	}

	function Banner(parentEl, obj){
		parentEl = this.checkParent(parentEl);

	}

	function ImageTextZone(parentEl, obj){
		parentEl = this.checkParent(parentEl);

	}

	function Footer(parentEl, obj){
		parentEl = this.checkParent(parentEl);

	}

	function Menu(parentEl, obj){
		parentEl = this.checkParent(parentEl);

	}

	function Grid(parentEl, obj){
		parentEl = this.checkParent(parentEl);

	}

	Button.prototype = focus;
	Banner.prototype = focus;
	ImageTextZone.prototype = focus;
	Footer.prototype = focus;
	Menu.prototype = focus;
	Grid.prototype = focus;
