window.onload = function(){
	var jst = new Button("",{
			class: ['pouh']
		});
		var firstBanner = new Banner ("", {
			class: ['breah']
		});

		var accordion = new Accordion ("", {
			id: 'bonobo',
			nbCols: 5,
			class :['shouldBeOptional'],
			height: '500px',
			placeholderUnactive: 'duuuuu!', 
			activeContent: 'bllllllllllllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah'
		});
		var grid = new Grid ("", {
			class: ['super', 'style', 'grid'],
			nbItems: 6,
			id:"badaboum",
			itemWidth: '350px'
		});
		var myFirstButton = new Button( ".gridItem", {
					text: "Fresh New Button",
					class: ["shinny"],
					events: [{
						type:'click',
						handler: function(event){
							console.log('clicked je fais pas les bails');
						}
					}]
				});
		var secondButton = new Button ( ".gridItem ", {
					text: "Fresh New Button2",
					class: ["shinny"],
					events: [{
						type: 'click',
						handler: function(event){
							console.log('clicked je fais les bails');
						}
					}]
				},1);
		var txtImg = new ImageTextZone ("", {
			id: 'tchula',
			class: ['dope'],
			imageAfter: true,
			imageWidth: '220px',
			imageHeight: '420px',
			url: 'images/js.png',
			alt: 'best thing in programmation',
			text:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariaturAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",


		});

		var scrolla = new Scroller ("body", {
			class: ['thci'],
			targets: ['.basic_button', '.accordionPlaceholder'],
			events: [{
				type: 'mouseover',
				handler: function(event){
				}
			}]
		});
	}