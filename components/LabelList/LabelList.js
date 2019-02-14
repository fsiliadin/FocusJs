/**
    * Generates one or several LabelList(s)
    * @constructor
    * @param {String} parentSelector - the selector that will determine the container(s) of the LabelList(s)
    * @param {Object} obj - the LabelList descriptor:
    *   class: an array of classes to be added to each LableList 
    *   id: the id of the LableList, if specified the LableList will be generated only in the first container
    *   events: an array of the event object to bind on the LableList:
    *       type: a string representing the type of event
    *       handler: the callback of the event
    *   title: the title of the LabelList, optional
    *   color: the color (ass a valid css color value) to set on the labels of the LabelList
    * @param {Number} positionInNodeList - the position of the LableList between its siblings
    */
function LabelList(parentSelector, obj, positionInNodeList) {
    var parentEl = this.checkParent(parentSelector)
    var self = this

    /**
        * Generates LabelList html and inserts it in the proper container in the DOM
        * @param {NodeList} container - contains element LabelLists will be generated in. (one LabelList per element)
        * @param {Object} descriptor - the LabelList descriptor
        * @return {Array} an array of LabelList data:
        *   hash: the hash of the generated LabelList
        *   element: the LabelList element as it is in the DOM
        *   color: the color of the labels
        *   container: the parent element of each generated LabelList
        *   labels: the labels of the LabelList as an array
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
            descriptor.class.indexOf('basic_labelList') === -1 ? descriptor.class.push('basic_labelList'):''
            classes = descriptor.class.join(' ')
            var hash = focus.generateHash()
            html += '<div class ="'+classes+'" data-hash= '+hash+' id = '+(descriptor.id||'')+'>'
            if(descriptor.title) {
                html += '<span class= "title">'+descriptor.title+': </span>'
            }

            descriptor.labels.forEach(function (label) {
                html += '<span class= "label" data-hash='+ focus.generateHash()+ ' style="background-color:'+descriptor.backgroundColor+'; color:'+descriptor.color+'!important">' + label + '</span>'
            })
            html += '</div>'
            ret = self.__proto__.generate(html, item, positionInNodeList)
            var elData = {
                hash: hash,
                element: ret,
                container: item,
                labels: descriptor.labels,
                colors: {
                    backgroundColor: descriptor.color,
                    color: descriptor.color
                }
            }
            res = focus.recordElData(elData, res)
            if(typeof descriptor.events !== 'undefined') {
                self.delegateEvent(hash, descriptor.events)
            }
        })
        return res
    }
    /**
        * adds specified label to the LabelList
        * @param {String} label - the label to add
        * @param {DOMElement} labelList - the LabelList to add the label to, since the LabelList constructor generates a LabelList per parent, there could be several LabelList generated.
        *       Therefore we should specify the one we want to add the label to,
        *       otherwise the label will be added to every generated LabelList
        */
    this.add = function (label, labelList) {
        var generatedLabelLists = this.generated()
        html = '<span class= "label" data-hash='+ focus.generateHash()+ ' style="background-color:'+generatedLabelLists[0].color+'">' + label + '</span>'
        if (labelList) {                
            labelList.labels.push(label)
            this.__proto__.generate(html, labelList.element)
        } else {
            generatedLabelLists.forEach(function(generatedLabelList){
                generatedLabelList.labels.push(label)
                this.__proto__.generate(html, generatedLabelList.element)
            }.bind(this))
        }
            
    }

    /**
        * Removes specified label from the LabelList
        * @param {String} label - the label to remove
        * @param {DOMElement} labelList - the LabelList to remove the label from, since the LabelList constructor generates a LabelList per parent, there could be several LabelList generated.
        *       Therefore we should specify the one we want to remove the label from,
        *       otherwise the label will be removed from every generated LabelList
        */
    this.remove = function (label, labelList) {
        var generatedLabelLists = this.generated()
        if(labelList) {
            labelList.labels.splice(labelList.labels.indexOf(label), 1)
            labelList.element.querySelectorAll('.label')[index].remove()
        } else {
            generatedLabelLists.forEach(function(generatedLabelList){
                var index = generatedLabelList.labels.indexOf(label)
                generatedLabelList.labels.splice(index, 1)
                generatedLabelList.element.querySelectorAll('.label')[index].remove()
            })
        }
    }
    var generated = this.generate(parentEl, obj)
    /**
        *   Gets the LabelList updated data
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

LabelList.prototype = focus