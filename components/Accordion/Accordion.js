
function Accordion (parentSelector, obj, positionInNodeList){
    var parentEl = this.checkParent(parentSelector)
    this.generate = function (container, descriptor) {
        var html = ''
        var classes = ''
        if (typeof descriptor.id !== 'undefined') {
            container = [container[0]]
        }
        if (!(descriptor.class instanceof Array)) {
            descriptor.class = []
        }
        var self = this

        Array.prototype.forEach.call(container, function(item, index){
            descriptor.class.indexOf('basic_accordion') === -1 ? descriptor.class.push('basic_accordion'):''
            classes = descriptor.class.join(' ')
            self.hash = focus.generateHash()
            html = '<table class = "'+classes+'" data-hash="'+self.hash+'" id ="'+descriptor.id+'"style = "height:'+descriptor.height+'"><tr>'
            for (var i = 0; i < descriptor.nbCols; i++) {
                if (i === descriptor.nbCols - 1) {
                    i = 'Last'
                }
                html += '<td class ="accordionItem" data-hash='+focus.generateHash()+'><div class="accordionPlaceholder" data-hash='+focus.generateHash()+'>'+descriptor.placeholderUnactive+'</div><div class= "accordionContent" data-hash='+focus.generateHash()+'>'+descriptor.activeContent+'</div></td>'
            }
            html += '</tr></table>'
            self.__proto__.generate(html, item, positionInNodeList)
            if(typeof descriptor.events !== 'undefined') {
                self.delegateEvent(self.hash, descriptor.events)
            }
        })
    }

    this.generate(parentEl, obj)
}


Accordion.prototype = focus