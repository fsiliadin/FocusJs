
function ResultListDisplayer(parentSelector, obj, positionInNodeList) {
    var parentEl = this.checkParent(parentSelector)
    var self = this
    this.generate = function (container, descriptor) {
        var html = ''
        var classes  = ''
        var res = [], ret, displayerBody
        if (typeof descriptor.id !== 'undefined') {
            container = [container[0]]
        }
        if (!(descriptor.class instanceof Array)) {
            descriptor.class = []
        }
        Array.prototype.forEach.call(container, function (item, index){
            descriptor.class.indexOf('basic_ResultListDisplayer') === -1 ? descriptor.class.push('basic_ResultListDisplayer'):''
            classes = descriptor.class.join(' ')
            var hash = focus.generateHash()
            html += '<div class ="' + classes + '" data-hash= ' + hash + ' data-index=' + index + ' id = '+(descriptor.id||'')+'>'
            html += '<span data-hash = '+focus.generateHash()+' data-index=' + index + ' class = "navButton"><</span><span class="displayerBody">'
            var numberOfPages = Math.ceil(descriptor.list.length / descriptor.nbElPerPage)
            for (var i = 1; i <= numberOfPages ; i++) {
                html += '<span data-hash = '+focus.generateHash()+' data-index=' + index + '>'+i+'</span>'
            }
            html += '</span><span data-hash = '+focus.generateHash()+' data-index=' + index + ' class = "navButton">></span>'
            html += '</div>'
            ret = self.__proto__.generate(html, item, positionInNodeList)
            displayerBody = ret.querySelector('.displayerBody').children
            Array.prototype.forEach.call(displayerBody, function (child) {
                focus.bindEvent(child, [{
                    type: 'click',
                    handler: function(e) {
                        var currentResultListDisplayer = this.generated()[e.target.dataset.index]
                        currentResultListDisplayer.activeButton = e.target
                        var pageToDisplay = currentResultListDisplayer.activeButton.innerText || currentResultListDisplayer.activeButton.innerHTML

                        Array.prototype.forEach.call(currentResultListDisplayer.navButtons, function(pageIndex){
                            focus.removeClass(pageIndex, 'activeButton')
                        })
                        focus.addClass(currentResultListDisplayer.activeButton, 'activeButton')

                        if ((currentResultListDisplayer.previousActiveButton === currentResultListDisplayer.activeButton) && currentResultListDisplayer.previousActiveButton.innerHTML != 1) {
                            return
                        }
                        currentResultListDisplayer.previousActiveButton = currentResultListDisplayer.activeButton
                        currentResultListDisplayer.currentPage = pageToDisplay | 0
                        for (var i = (pageToDisplay - 1) * currentResultListDisplayer.nbElPerPage; i < pageToDisplay * currentResultListDisplayer.nbElPerPage; i++) {
                            if (i >= currentResultListDisplayer.fullList.length) {
                                break
                            }
                            currentResultListDisplayer.render(currentResultListDisplayer.fullList[i], i)
                            currentResultListDisplayer.alreadyGeneratedItems.push(i)
                        }                          

                    }.bind(self)
                }])
            })
            Array.prototype.forEach.call(ret.querySelectorAll('.navButton'), function (navButton) {
                focus.bindEvent(navButton, [{
                    type: 'click',
                    handler: function(e) {
                        var currentResultListDisplayer = this.generated()[e.target.dataset.index]
                        var pageToDisplay = e.target.innerText || e.target.innerHTML
                        pageToDisplay = pageToDisplay === '<' ? currentResultListDisplayer.activeButton.innerText - 1 : currentResultListDisplayer.activeButton.innerText - (-1)
                        if (pageToDisplay < 1 || pageToDisplay > numberOfPages) {
                            return
                        }
                        currentResultListDisplayer.navButtons[pageToDisplay - 1].click()
                        currentResultListDisplayer.navButtons[0].parentElement.scrollTo((pageToDisplay - 1) * 21, 0)
                    }.bind(self)
                                
                }])
            })
                
            var elData = {
                hash: hash,
                element: ret,
                container: item,
                navButtons: displayerBody,
                activeButton: displayerBody[0],
                previousActiveButton: displayerBody[0],
                alreadyGeneratedItems: [],
                nbElPerPage: descriptor.nbElPerPage,
                fullList: descriptor.list,
                render: descriptor.render,
                currentPage: 1
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
        *   Gets the ResultListDisplayer updated data
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
    setTimeout(function(){
        var customEvent = new Event('click', {'bubbles':true, 'cancelable':false})
        generated[0].activeButton.dispatchEvent(customEvent)
    }, 0)
        
}

ResultListDisplayer.prototype = focus