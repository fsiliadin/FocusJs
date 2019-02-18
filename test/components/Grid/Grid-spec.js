var Grid = require('../components/Grid/Grid')

describe('Grid Object default generation', () => {
	beforeEach(() => {
  	document.body.innerHTML = '<div id="div1"></div><span id="span1"></span><div id="div2"><span class="subspan"></span><span class="subspan"></span></div>'
	})

  it('should generate a Grid in the elements matching the passed selector', () => {
  	new Grid('#div2 .subspan', {})
  	const generatedElements = document.querySelectorAll('#div2 .subspan .basic_grid')
  	expect(generatedElements.length).to.equal(document.querySelectorAll('#div2 .subspan').length)
  })

  it('should generate a Grid in the body if no selector passed', () => {
  	new Grid('', {})
  	expect(document.querySelector('body > .basic_grid')).to.exist
  })

  it('should add the passed classes to the Grid', () => {
  	const classes = (() => {
  		const arr = []
  		const length = Math.floor(Math.random() * 10)
  		for (let i = 0; i < length; i++) {
  			arr.push('class'+i)
  		}
  		return arr
  	})()
  	new Grid('', {
  		class: classes
  	})
  	const generatedElementClassList = Array.prototype.join.call(document.querySelector('.basic_grid').classList, '')
  	expect(generatedElementClassList).to.equal(classes.join(''))
  })

  it('should generate the amount of gridItem as the nbItems property', () => {
  	const nbItems = (() => {
			return Math.floor(Math.random() * 10)
		})()
  	new Grid('', {
  		nbItems: nbItems
  	})
  	expect(document.querySelectorAll('.basic_grid > .gridItem').length).to.equal(nbItems)
  })

  it('should set all items to the size of itemWidth and itemHeight', () => {
  	const width = (() => {
  		return Math.floor(Math.random() * 400) + 'px'
  	})()
  	const height = (() => {
  		return Math.floor(Math.random() * 400) + 'px'
  	})()
  	new Grid('', {
  		itemHeight: height,
  		itemWidth: width,
  		nbItems: 5
  	})
  	Array.prototype.forEach.call(document.querySelectorAll('.gridItem'), (gridItem) => {
  		expect(gridItem.style.width).to.equal(width)
  		expect(gridItem.style.height).to.equal(height)
  	})
  })

  it('should set heights to width size if heights not specified', () => {
  	const width = (() => {
  		return Math.floor(Math.random() * 400) + 'px'
  	})()
  	new Grid('', {
  		itemWidth: width,
  		nbItems: 5
  	})
  	Array.prototype.forEach.call(document.querySelectorAll('.gridItem'), (gridItem) => {
  		expect(gridItem.style.width).to.equal(width)
  		expect(gridItem.style.height).to.equal(width)
  	})
  })

})
