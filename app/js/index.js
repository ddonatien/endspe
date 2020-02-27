
jQuery($ => {

	// var phyloDatas = loadCSV("https://github.com/ddonatien/endspe/blob/master/app/data/phylo.csv");
	// console.log(phyloDatas);

	//var phyloItems = JSON.parse('{{itemList | tojson | safe}}');

	var items = ["Animalia", "PLANTAE", "CHORDATA"];
	//phyloItems.forEach(item => items.push(item))

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
    	const Http = new XMLHttpRequest();

	  	let url=`https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&prop=extracts&exintro=&search=${result}&format=json`;
	    Http.open("GET", url, true);
	    Http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	    Http.responseType = 'json';
	    Http.send();

	    Http.onreadystatechange = (e) => {
			let pageTitle = Http.response[1][0];
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

					let url=`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=images&titles=${pageTitle}&format=json`;
					Http.open("GET", url, true);
					Http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
					Http.responseType = 'json';
					Http.send();

					Http.onreadystatechange = (e) => {
						let images = Http.response.query.pages[key].images[0].title.replace('File:', '');
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
		          $("#wiki").append("<p>No wikipedia page found :(</p>");
		        }
			}
	    }}
	})

		
	function loadCSV(url) {
		var data;
		
		$.ajax({
		  type: "GET",  
		  url: url,
		  dataType: "text",       
		  success: function(response)  
		  {
			data = $.csv.toArrays(response);
		  }   
		});

		return data
	}


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
})
