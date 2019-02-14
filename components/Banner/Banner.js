
function Banner(parentSelector, obj, positionInNodeList){
    var parentEl = this.checkParent(parentSelector)
    this.generate = function (container, descriptor) {
        var html = ''
        var classes = '' 
        // if the element to be create has an id so we only create one in the first matchin component
        if(typeof descriptor.id !== 'undefined') {
            container = [container[0]]
        }
        if (!(descriptor.class instanceof Array)) {
            descriptor.class = []
        }
        var self = this
        Array.prototype.forEach.call(container, function(item, index){
            descriptor.class.indexOf('basic_banner') === -1 ? descriptor.class.push('basic_banner'): ''
            classes = descriptor.class.join(' ')
            self.hash = focus.generateHash()
            html =  '<div><div class = "shadow-top" style = "height:4px"></div><div id="'+descriptor.id+'" class ="'+classes+'" data-hash="'+self.hash+'""></div><div class = "shadow-bottom" style = "height:15px"></div>'

            self.__proto__.generate(html, item, positionInNodeList)
            if(typeof descriptor.events !== 'undefined') {
                self.delegateEvent(self.hash, descriptor.events)
            }

        })
    }       
    this.generate(parentEl, obj)
}


Banner.prototype = focus