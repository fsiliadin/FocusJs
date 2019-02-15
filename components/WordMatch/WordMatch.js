var focus = require('../focus')
/**
    * WordMatch objects need to be attached to a text input, and should be passed an array of words
    * It matches the strings inputed with the strings in the array
    * @constructor
    * @param {DOMElement} textInput - the text input to listen to
    * @param {Array} wordsArray - the string array to search
    *
    */
function WordMatch(textInput, wordsArray) {
    this.wordsArray = wordsArray
    this.textInput = textInput
    this.sortedWords = []
    // on keypress, we calculate the match rate of the inputed string with every string in the wordsArray
    this.customEvent = new CustomEvent('matchingComplete')
    focus.bindEvent(this.textInput, [{
        type: 'keydown',
        handler:  function (event) {
            if(event.key === 'Backspace') {
                setTimeout(function() {
                    if(!event.target.value.length) {
                        this.sortedWords = this.wordsArray
                    } else {
                        var inputValue = event.target.value
                        this.sortedWords = this.getMatchingWords(inputValue)                      
                    }
                    this.textInput.dispatchEvent(this.customEvent)  
                }.bind(this), 500)
            } 
            setTimeout(function(){                
                var inputValue = event.target.value 
                this.sortedWords = this.getMatchingWords(inputValue)
                this.textInput.dispatchEvent(this.customEvent)
            }.bind(this), 500)
        }.bind(this)
    }])

    /**
        * Gets the words that match the inputed one
        * @param {String} wordToMatch - the inputed word
        * @return {Array} - A sorted array of the words matching the most the inputed one
        */
    this.getMatchingWords = function getMatchingWords(wordToMatch) {
        var limen = 0
        switch(wordToMatch.length) {
        case 1: limen = 0; break
        case 2: limen = 0.50; break
        case 3: limen = 0.75; break
        case 4: limen = 0.85; break
        case 5: limen = 0.90; break
        case 6: limen = 0.95; break
        default: limen = 0.99; break
        }
        return this.wordsArray.map(function(word) {
            return {
                word: word,
                rate: this.matchRate(word, wordToMatch)
            }
        }.bind(this)).sort(function (a, b){
            return b.rate - a.rate
        }).filter(function(wordObj){
            return wordObj.rate > limen
        }).map(function (wordObj){
            return wordObj.word
        })
    }

    /**
        * Calculates the matching rate between two words
        * @param {String} ref - the reference word
        * @param {String} word - the inputed word
        * @return {Number} - a match percentage between the two words
        */
    this.matchRate = function matchRate(ref, word) {
        //  we do consider that if word is a substring of ref then there is a match
        if (ref.toUpperCase().indexOf(word.toUpperCase()) !== -1) {
            return 1
        }
        var rate = 0
        var refRate = 0
        for (var i = ref.length -1; i >= 0 ; i--) {
            refRate += Math.pow(2, i)
        }
        for (i = 0; i < word.length; i++) {
            if (i < ref.length) {
                rate += (ref.charAt(i).toUpperCase() === word.charAt(i).toUpperCase()) * Math.pow(2, ref.length - 1 - i)
            } else {
                rate -= Math.pow(2, i - ref.length)
            }
        }
        return rate/refRate
    }
}


WordMatch.prototype = focus
module.exports = WordMatch