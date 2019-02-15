var Button = require('./components/Button/Button')
var RateSlider = require('./components/RateSlider/RateSlider')
var Slider = require('./components/Slider/Slider')
var Grid = require('./components/Grid/Grid')
var Scroller = require('./components/Scroller/Scroller')
var WordMatch = require('./components/WordMatch/WordMatch')

window.onload = function(){
    var jst = new Button('',{
        class: ['pouh'],
        id:'fd',
        events: [{
            type: 'click',
            handler: function(){
                console.log('"undefined" button clicked')
            }
        }]
    })
    // 	var firstBanner = new Banner ("", {
    // 		class: ['breah']
    // 	});

    // 	var accordion = new Accordion ("", {
    // 		id: 'bonobo',
    // 		nbCols: 5,
    // 		class :['shouldBeOptional'],
    // 		height: '500px',
    // 		placeholderUnactive: 'duuuuu!', 
    // 		activeContent: 'bllllllllllllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah'
    // 	});
    // 	var grid = new Grid ("", {
    // 		class: ['super', 'style', 'grid'],
    // 		id:"badaboum",
    // 		itemWidth: '350px',
    // 		nbItems:1,
    // 		contents: [{
    // 	 		content: 'jst',
    // 	 		positionInNodeList: 3,
    // 	 		width: "300px"
    // 	 	}, {
    // 	 		content: 'yaparitaneeeeeeeh',
    // 	 		width: '200px',
    // 	 		height:' 400px'
    // 	 	}, {
    // 	 		content: 'itadakimaaaaaaaaaaaaaaaaaaaaassu',
    // 	 		positionInNodeList:0
    // 	 	}]
    // 	});
    // 	// grid.addItem({
    // 	// 	width: '600px',
    // 	// 	height:'440px',
    // 	// 	content: 'jst',
    // 	// 	positionInNodeList:2,
    // 	// 	to: grid.generated()[0]
    // 	// });
    // 	//  grid.removeItem({
    // 	//  	positionInNodeList:3,
    // 	//  	from: grid.generated()[0]
    // 	//  });

    // 	var myFirstButton = new Button( ".gridItem", {
    // 				text: "Fresh New Button",
    // 				class: ["shinny"],
    // 				events: [{
    // 					type:'click',
    // 					handler: function(event){
    // 						console.log('clicked je fais pas les bails');
    // 					}
    // 				}]
    // 			});
    // 	var secondButton = new Button ( "", {
    // 				text: "Fresh New Button2",
    // 				class: ["shinny"],
    // 				events: [{
    // 					type: 'click',
    // 					handler: function(event){
    // 						console.log('clicked je fais les bails');
    // 					}
    // 				}]
    // 			},1);
    // 	var txtImg = new ImageTextZone (".gridItem", {
    // 		// id: 'tchula',
    // 		class: ['dope'],
    // 		imageAfter: true,
    // 		imageWidth: '220px',
    // 		imageHeight: '420px',
    // 		url: 'images/js.png',
    // 		alt: 'best thing in programmation',
    // 		text:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariaturAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",


    // 	});
    // grid.populate({
    //  	grid: grid.generated()[0],
    //  	contents: [{
    //  		content: 'jst',
    //  		positionInNodeList: 3
    //  	}, {
    //  		content: 'yaparitaneeeeeeeh'
    //  	}, {
    //  		content: 'itadakimaaaaaaaaaaaaaaaaaaaaassu',
    //  		positionInNodeList:0
    //  	}]
    //  });

    // grid.generated()[0].gridItems[2].modify({
    // 	width: "600px",
    // 	height: '600px'
    // });

		
    var n = new RateSlider('.gridItem', {
        maxRate: 5,
        initialValue: 02,
        readOnly: false
    }, 0)
    console.log(n)
    n.setValue(5, n.generated()[2])
    var newSlider = new Slider('', {
        label: 'swag level',
        min: 0,
        max: 200,
        subSliders: [
            {
                label: 'inheritedsfdffdsfqdsfdsqfqdqsf',
                color: 'blue',
                value: 33
            }, {
                label: 'acquired Swag',
                color: 'green',
                value: 33
            }, {
                label: 'other',
                color: 'green',
                value: 33
            }]
    })
    var grid2 = new Grid ('', {
        class: ['super', 'style', 'grid', 'listAlikeGrid'],
        id:'badabousm',
        itemWidth: '700px',
        itemHeight: '100px',
        nbItems:13,
        checkable: 'single'
    })
    var scrolla = new Scroller ('.gridItem, body', {
        class: ['thci'],
        targets: ['.basic_button', '.accordionPlaceholder', '.bli']
    })
    // grid2.generated()[0].gridItems[1].addContent({
    // 	content: jst
    // });
    newSlider.setValue(56)
    jst.changeText('jesusScript is back')
    var a = document.querySelector('#testtext')
    console.log('a', a)
    var wordMatch = new WordMatch(a, ['abcdefghij', 'République', 'Bastille', 'Quartier Latin', 'ruedu'])
		
}