
jQuery($ => {

	// Handling choice of reign to display phylo tree
	$('.display_animal').click(() => 
		{
			localStorage.setItem("current-reign-url", "https://raw.githubusercontent.com/ddonatien/endspe/master/app/data/phylo_animal_genus.csv");
			location.reload();
		}
	);
	$('.display_plant').click(() => 
		{
			localStorage.setItem("current-reign-url", "https://raw.githubusercontent.com/ddonatien/endspe/master/app/data/phylo_plant_genus.csv");
			location.reload();
		}
	);

	$('#animal_from_about').click(() => 
		{
			localStorage.setItem("current-reign-url", "https://raw.githubusercontent.com/ddonatien/endspe/master/app/data/phylo_animal_genus.csv");
			window.location.assign("index.html");
		}
	);
	$('#plant_from_about').click(() => 
		{
			localStorage.setItem("current-reign-url", "https://raw.githubusercontent.com/ddonatien/endspe/master/app/data/phylo_plant_genus.csv");
			window.location.assign("index.html");
		}
	);

	// Handling elastic search with autocomplete
	var items = loadCSV('https://raw.githubusercontent.com/ddonatien/endspe/master/app/data/phylo.csv');

	new Autocomplete('#autocomplete', {
		search: input => {
			if (input.length < 1) { return [] }
			var items1 = items.filter(title => {
				return title.toLowerCase()
				.startsWith(input.toLowerCase())
			});
			var items2 = [];
			if (input.length >= 3){
			    items2 = items.filter(title => {
					return (
						title.toLowerCase()
						.includes(input.toLowerCase())) &&
						(!(title.toLowerCase()
						.startsWith(input.toLowerCase())))
			    });
			}
			return items1.concat(items2)
		},
		onSubmit: result => {
			displayWikiExtract(result);
		},
		autoSelect: true
	})


	function loadCSV(url) {
		var rawItems = [];
		var items = [];

	    d3.csv(url, function(error, data) {
			if (error) console.log(error);
			else {
				var array = data.map((d) => d.id);

				array.forEach((d) => {
					if (rawItems.indexOf(d) == -1) {
						rawItems.push(d);
					}
				})
			}

		    rawItems.forEach((d) => {
		    	l = d.split('.').reverse();

		    	for (i in l) {
		    		if (items.indexOf(l[i]) == -1 && l[i] != '') {
						items.push(l[i]);
					}
					else {
						break;
					}
		    	}
		    });

		    for (i in items) {
		    	items[i] = items[i][0].toUpperCase() + items[i].substring(1).toLowerCase();
		    }
	  	});

	  	return items;
	}

	function displayWikiExtract(result) {
		d3.select("#thlevel").style("visibility", "hidden");
		d3.select("#thlevel").select('svg').html('');
		$("#wiki").empty();
		$("#illustration").attr("src", '');

		const Http = new XMLHttpRequest();

		let url=`https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&prop=extracts&exintro=&search=${result}&format=json`;
		Http.open("GET", url, true);
		Http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
		Http.responseType = 'json';
		Http.send();

		Http.onreadystatechange = (e) => {
			let pageTitle = Http.response[1][0];
			console.log(Http.response);
			console.log(pageTitle);
			if (pageTitle != 'Undefined') {
				let wikiUrl = Http.response[3][0];
				let url=`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&exintro=&titles=${pageTitle}&format=json`;
				Http.open("GET", url, true);
				Http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
				Http.responseType = 'json';
				Http.send();

				Http.onreadystatechange = (e) => {
					let pages = Http.response.query.pages;
					let key = Object.keys(pages)[0];
					if (key) {
						if (pages[key].extract) {
							$("#wiki").append(pages[key].extract);
						}
						else {
							$("#wiki").append("<p>No wikipedia extract :(</p><br>");
						}

						$("#wiki").append("<a href='" + wikiUrl + "'>Wiki link</a>");

						let url=`https://www.wikidata.org/w/api.php?origin=*&action=wbgetentities&format=json&sites=enwiki&props=claims&titles=${pageTitle}`;
						Http.open("GET", url, true);
						Http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
						Http.responseType = 'json';
						Http.send();

						Http.onreadystatechange = (e) => {
							let key = Object.keys(Http.response.entities)[0];
							let images = Http.response.entities[key].claims.P18[0].mainsnak.datavalue.value;
							let url=`https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=Image:${images}&format=json&prop=imageinfo&iiprop=url`;
							Http.open("GET", url, true);
							Http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
							Http.responseType = 'json';
							Http.send();

							Http.onreadystatechange = (e) => {
								let ipages = Http.response.query.pages;
								let ikey = Object.keys(ipages)[0];
								let imurl = ipages[ikey].imageinfo[0].url;
								if (imurl) {
									$("#illustration").attr("src", imurl);
								}
							}
						}
					}
					else {
						$("#wiki").append('<p id="no-wiki">No wikipedia page found :(</p>');
					}
				}
			}
			else {
				$("#wiki").append('<p id="no-wiki">No wikipedia page found :(</p>');
			}
		}
	}
})
