
/**
    * Generates one or several ImageTextZone(s).
    * @constructor
    * @param {String} parentSelector - the selector that will determine the container(s) of the ImageTextZone(s)
    * @param {Object} obj - the ImageTextZone descriptor:
    *   class: an array of classes to be added to each ImageTextZone
    *   id: the id of the ImageTextZone, if specified the ImageTextZone will be generated only in the first container
    *   events: an array of the event object to bind on the ImageTextZone:
    *       type: a string representing the type of event
    *       handler: the callback of the event
    *       imageAfter: boolean, true if you want the image to be displayed after the text
    *       imageWidth: the width of the image as valid css between quotes,
    *       imageHeight: 'the height of the image as valid css between quotes',
    *       url: the url of the image,
    *       alt: image alt,
    *       text: the text
    * @param {Number} positionInNodeList - the position of the ImageTextZone between its siblings
    */
function ImageTextZone(parentSelector, obj, positionInNodeList){
    var parentEl = this.checkParent(parentSelector)
    /**
        * Generates ImageTextZone html and inserts it in the proper container in the DOM
        * @param {NodeList} container - contains element ImageTextZone will be generated in. (one button per element)
        * @param {Object} descriptor - the ImageTextZone descriptor
        *
        * @return {Array} an array of ImageTextZone data:
        *   hash: the hash of the generated ImageTextZone
        *   element: the ImageTextZone element as it is in the DOM   
        *   container: the parent element of each generated ImageTextZone
        *   image: the image of the ImageTextZone
        *   text: the text of the imageTextZone
        */
    this.generate = function (container, descriptor) {
        var html = ''
        var classes = ''
        var res = [], ret
        if (typeof descriptor.id !== 'undefined') {
            container = [container[0]]
        }
        if (!(descriptor.class instanceof Array)) {
            descriptor.class = []
        }
        var self = this
        Array.prototype.forEach.call(container, function(item, index){
            descriptor.class.indexOf('basic_imageTextZone') === -1 ? descriptor.class.push('basic_imageTextZone'):''
            classes = descriptor.class.join(' ')
            var hash = focus.generateHash()
            html = '<table class= "'+classes+'" data-hash="'+hash+'" id ="'+descriptor.id+'"><tr class="body">'
            if(descriptor.imageAfter) {
                html += '<td class ="text" data-hash='+focus.generateHash()+' ><p>'+descriptor.text+'</p></td>'
                html += '<td class ="image" data-hash='+focus.generateHash()+' ><img class ="bli" data-hash='+focus.generateHash()+' src="'+descriptor.url+'" alt= "'+descriptor.alt+'" style ="width:'+descriptor.imageWidth+'; height:'+descriptor.imageHeight+';"></td>'
            } else {
                html += '<td class ="image" data-hash='+focus.generateHash()+' ><img class ="bli" data-hash='+focus.generateHash()+' src="'+descriptor.url+'" alt= "'+descriptor.alt+'" style ="width:'+descriptor.imageWidth+'; height:'+descriptor.imageHeight+';"></td>'
                html += '<td class ="text" data-hash='+focus.generateHash()+' ><p>'+descriptor.text+'</p></td>'
            }
            html += '</tr></table>'
            ret = self.__proto__.generate(html, item, positionInNodeList)
            var elData = {
                hash: hash,
                element: ret,
                container: item,
                image: descriptor.url,
                text: descriptor.text
            }
            res = focus.recordElData(elData, res)
            if(typeof descriptor.events !== 'undefined') {
                self.delegateEvent(hash, descriptor.events)
            }
        })
        return res
    }
    var generated = this.generate(parentEl, obj)
    /**
        *   Gets the ImageTextZone updated data
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
}


ImageTextZone.prototype = focus