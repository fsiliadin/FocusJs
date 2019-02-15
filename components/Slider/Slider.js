var focus = require('../focus')

/**
    * Generates one or several Slider(s).
    * @constructor
    * @param {String} parentSelector - the selector that will determine the container(s) of the Slider(s)
    * @param {Object} obj - the Slider descriptor:
    *   class: an array of classes to be added to each Slider
    *   id: the id of the Slider, if specified the Slider will be generated only in the first container
    *   events: an array of the event object to bind on the Slider:
    *       type: a string representing the type of event
    *       handler: the callback of the event
    *   label: the Slider title
    *   value: initial value of the Slider
    *   min: Slider's min value
    *   max: Slider's max value
    *   subSliders: an array of Slider subzones
    *       label: label of the subzone
    *       color: color of the subzone
    *       value: initial value of the subzone
    * @param {Number} positionInNodeList - the position of the Slider between its siblings
    */
function Slider (parentSelector, obj, positionInNodeList) {
    var parentEl = this.checkParent(parentSelector)
    this.generate = function (container, descriptor) {
        var html = ''
        var classes = ''
        var res = [], ret
        // if the programmer specifies an id, only the first node el is taken in account
        // can't have several object with the same id
        if(typeof descriptor.id !== 'undefined') {
            container = [container[0]]
        }
        if (!(descriptor.class instanceof Array)) {
            descriptor.class = []
        }
        if( !(descriptor.subSliders instanceof Array)){
            descriptor.subSliders = []
        }
        var self = this
        // for each node el taken in account is generated an html
        Array.prototype.forEach.call(container, function(item, index){
            descriptor.class.indexOf('basic_slider') === -1 ? descriptor.class.push('basic_slider') : ''
            classes = descriptor.class.join(' ')
            // creation of a hash to identify each element
            var hash = focus.generateHash()
            html = '<div id="'+descriptor.id+'" class=' + classes + ' data-hash="'+hash+'" data-index='+ index +' ><span class="sliderTitleLabel" data-hash="'+focus.generateHash()+'">'+(descriptor.label ? descriptor.label+':' : '')+' <span class="sliderValue" data-hash = "'+focus.generateHash()+'">'+descriptor.value+'</span></span><div class="sliderCore" data-hash='+focus.generateHash()+'>'
            html += '<span class="minValue" data-hash='+ focus.generateHash() +' >'+ descriptor.min + '</span>'
            html += '<div class ="sliderMechanics" data-hash='+ focus.generateHash() +'>'
            html += '<div class ="sliderAxis" data-hash='+ focus.generateHash() +'></div>'
            html += '<div class ="dynamicItemsContainer" data-hash='+ focus.generateHash() +'>'
            html += '<div class ="mainSlideZone" data-hash='+ focus.generateHash() +'>'
            for (var i = 0; i < descriptor.subSliders.length; i++) {
                html += '<div class="subSlideZone" data-hash='+ focus.generateHash() +'  data-index='+i+'>'+ descriptor.subSliders[i].label +'</div>'
                if (i !== descriptor.subSliders.length - 1) {
                    html += '<div class="subCursor" data-hash='+ focus.generateHash() +' data-index='+i+'></div>'  
                }             
            }
            html += '</div>' // mainSlideZone end
            html += '<div class ="mainCursor" data-hash='+ focus.generateHash() +'></div>'
            html += '</div>' // dynamicItemsContainer end
            html += '</div>' // sliderMechanics end 
            html += '<span class="maxValue" data-hash='+ focus.generateHash() +' >'+ descriptor.max + '</span>'
            html += '</div>' // coreSlider end
            html += '</div>' // slider end
            ret = self.__proto__.generate(html, item, positionInNodeList)
            var subSliders = ret.querySelectorAll('.subSlideZone')
            var elData = {
                hash: hash,
                element: ret,
                container: item,
                value: descriptor.value,
                min: descriptor.min,
                max: descriptor.max,
                subSliders: descriptor.subSliders.map(function(subSlider, index){
                    return {
                        element: subSliders[index],
                        value: descriptor.subSliders[index].value
                    }
                })
            }
            res = focus.recordElData(elData, res)
            if(typeof descriptor.events !== 'undefined') {
                self.delegateEvent(hash, descriptor.events)
            }

                                    
            Array.prototype.forEach.call(ret.querySelectorAll('.mainCursor, .subCursor'), function(cursor){
                focus.bindEvent(cursor, [{
                    type: ['touchstart', 'mousedown'],
                    handler: function (e) {
                        focus.dragDropEl.push(e.target)
                    }
                }])
            })
            focus.bindEvent(ret, [{
                type: ['touchend', 'mouseup'],
                handler: function () {
                    focus.dragDropEl.length = 0
                }
            }, {
                type: ['touchmove', 'mousemove'],
                handler: (function(ret) {
                    return function (e) {
                        var movementX    
                        if (!('movementX' in e)) {
                            movementX = e.changedTouches[0].clientX - focus.getPositionInArea(e.target, document.querySelector('BODY')).left
                        } else {
                            movementX = e.movementX
                        }
                        var slider = self.generated()[ret.dataset.index]                                    
                        if (focus.dragDropEl.length && focus.hasClass(focus.dragDropEl[0], 'mainCursor')) { 
                            var cursorPos = focus.dragDropEl[0].offsetLeft + movementX
                            var sliderAxisWidth = (slider.element.querySelector('.sliderAxis').offsetWidth - 12)
                            if (cursorPos <= sliderAxisWidth && cursorPos >= 0){
                                focus.dragDropEl[0].style.left = cursorPos + 'px'
                            }                                     
                            slider.element.querySelector('.mainSlideZone').style.width = focus.dragDropEl[0].style.left
                            var slider = self.generated()[slider.element.dataset.index]
                            slider.value = cursorPos * (slider.max - slider.min) / sliderAxisWidth + slider.min
                            slider.value = slider.value/Math.abs(slider.value) * Math.floor(Math.abs(slider.value))
                            slider.value = slider.value > slider.max ? slider.max : slider.value
                            slider.value = slider.value < slider.min ? slider.min : slider.value
                            var valueSpan = slider.element.querySelector('.sliderValue')
                            if (valueSpan.innerHTML !== slider.value+'') {
                                valueSpan.innerHTML = slider.value
                            }
                            Array.prototype.forEach.call(slider.element.querySelectorAll('.subCursor'), function (subCursor, index, list) {
                                subCursor.style.left = ((parseInt(subCursor.dataset.index) + 1) * (focus.dragDropEl[0].offsetLeft/(list.length+1)) - 10) + 'px'
                                Array.prototype.forEach.call(slider.element.querySelectorAll('.subSlideZone'), function(subZone, index){
                                    subZone.style.width = focus.dragDropEl[0].offsetLeft/(list.length+1) +'px'
                                    slider.subSliders[index].value = Math.trunc((slider.value - slider.min)/slider.subSliders.length)
                                })
                            })
                        } else if (focus.dragDropEl.length) {
                            cursorPos = slider.element.querySelector('.mainSlideZone').offsetWidth
                            focus.dragDropEl[0].style.left = (focus.dragDropEl[0].offsetLeft + movementX) +'px'
                            var subCursors = slider.element.querySelectorAll('.subCursor')  
                            var leftZone = slider.element.querySelector('.subSlideZone[data-index="'+focus.dragDropEl[0].dataset.index+'"]')
                            var rightZone = slider.element.querySelector('.subSlideZone[data-index="'+((focus.dragDropEl[0].dataset.index | 0) +1)+'"]')
                            leftZone.style.width =  (leftZone.offsetWidth + movementX) +'px'
                            rightZone.style.width =  (rightZone.offsetWidth - movementX) +'px'
                                    
                            var adjustementValue = 0
                            var unVoidZones = Array.prototype.filter.call(slider.element.querySelectorAll('.subSlideZone'), function(subZone) {
                                if (subZone.offsetWidth === 0) {
                                    var inc = (subZone.dataset.index == 0 || subZone.dataset.index == subCursors.length) ? 1 : 2
                                    adjustementValue += inc * subCursors[0].offsetWidth / 2
                                    if(subZone.dataset.virtualWidth > 0) {
                                        adjustementValue += subZone.dataset.virtualWidth
                                    }
                                    subZone.dataset.virtualWidth = -1
                                }
                                return subZone.offsetWidth > 0
                            })

                            Array.prototype.forEach.call(unVoidZones, function(unVoidZone) {
                                var inc = (unVoidZone.dataset.index == 0 || unVoidZone.dataset.index == subCursors.length) ? 1 : 2
                                unVoidZone.dataset.virtualWidth = unVoidZone.offsetWidth + inc * subCursors[0].offsetWidth / 2 + adjustementValue / unVoidZones.length
                            })
                            Array.prototype.forEach.call(slider.element.querySelectorAll('.subSlideZone'), function(subZone) {
                                subZone.dataset.virtualWidth = subZone.dataset.virtualWidth < 0 ? 0 : subZone.dataset.virtualWidth
                                slider.subSliders[subZone.dataset.index].value = Math.round(subZone.dataset.virtualWidth * (slider.value - slider.min) / cursorPos)
                            })
                            console.log(slider)
                        }
                    }
                })(ret)
            }, {
                type: 'mouseleave',
                handler: function(){
                    focus.dragDropEl.length = 0
                }
            }])
            focus.bindEvent(ret.querySelector('.dynamicItemsContainer'), [{
                type: 'click',
                handler: (function (ret) {
                    return function(e) {
                        console.log('eeeee', e)
                        var slider = self.generated()[ret.dataset.index]
                        // important, we query the cursor in the target because we don't want to perform actions below on click on mainSlideZone
                        // since mainSlideZone is before dynamicItemsContainer, we get cursor only if we click at the right of mainCursor 
                        // in others words the click can only set the slider value bigger
                        var cursor = e.target.querySelector('.mainCursor')
                        if(cursor) {
                            console.log('OOFFFSET LEFT', cursor.offsetLeft)
                            var cursorPos = e.offsetX
                            var sliderAxisWidth = (slider.element.querySelector('.sliderAxis').offsetWidth - 12)
                            if (cursorPos <= sliderAxisWidth && cursorPos >= 0){
                                cursor.style.left = cursorPos + 'px'
                            } 
                            slider.value = cursor.offsetLeft * (slider.max - slider.min) / sliderAxisWidth + slider.min
                            slider.value = slider.value/Math.abs(slider.value) * Math.floor(Math.abs(slider.value))
                            slider.value = slider.value > slider.max ? slider.max : slider.value
                            slider.value = slider.value < slider.min ? slider.min : slider.value
                            var valueSpan = slider.element.querySelector('.sliderValue')
                            if (valueSpan.innerHTML !== slider.value+'') {
                                valueSpan.innerHTML = slider.value
                            }
                            slider.element.querySelector('.mainSlideZone').style.width = cursor.style.left
                            Array.prototype.forEach.call(slider.element.querySelectorAll('.subCursor'), function (subCursor, index, list) {
                                subCursor.style.left = (((subCursor.dataset.index|0) + 1) * (cursor.offsetLeft/(list.length+1)) - 10) + 'px'
                                Array.prototype.forEach.call(slider.element.querySelectorAll('.subSlideZone'), function(subZone, index){
                                    subZone.style.width = cursor.offsetLeft/(list.length+1) +'px'
                                    slider.subSliders[index].value = Math.trunc((slider.value - slider.min)/slider.subSliders.length)
                                })
                            })
                            console.log('CLFDF', slider)
                        }
                    }
                })(ret)
            }])


        })
        return res
    }
    var generated = this.generate(parentEl, obj)

    this.setValue = function (value, slider) {
        if (slider) {
            slider.value = value
            var sliderAxisWidth = (slider.element.querySelector('.sliderAxis').offsetWidth - 12)
            mainCursorPos = (value - slider.min) * sliderAxisWidth / (slider.max - slider.min)  
            slider.element.querySelector('.mainCursor').style.left = mainCursorPos + 'px'
            console.log('mainCursorPos', mainCursorPos)
            var customEvent = new Event('click', {'bubbles':true, 'cancelable':false, 'offsetX': mainCursorPos})
            slider.element.querySelector('.dynamicItemsContainer').dispatchEvent(customEvent)
        } else {
            var self = this
            this.generated().forEach(function (slider) {
                self.setValue(value, slider)
            })
        }
    }
    /**
        *   Gets the Slider updated data
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

    console.log('generated', this.generated())

}


Slider.prototype = focus
module.exports = Slider