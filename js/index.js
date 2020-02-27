// var phyloItems = JSON.parse('{{itemList | tojson | safe}}');

// var items = [];
// phyloItems.forEach(item => items.push(item))

// new Autocomplete('#autocomplete', {
//   search: input => {
//     if (input.length < 1) { return [] }
//     var items1 = items.filter(title => {
//       return title.toLowerCase()
//         .startsWith(input.toLowerCase())
//     });
//     var items2 = [];
//     if (input.length >= 3){
//         items2 = items.filter(title => {
//           return (
//             title.toLowerCase()
//             .includes(input.toLowerCase())) &&
//             (!(title.toLowerCase()
//             .startsWith(input.toLowerCase())))
//         });
//     }
//     return items1.concat(items2)
//   },
//   onSubmit: result => {
//     if ( itemList.indexOf(result) >= 0 ) {
//         window.location.assign('item/' + `${result}`);
//     }
//     else if ( authorList.indexOf(result) >= 0 ) {
//         window.location.assign('author/' + `${result}`);
//     }
//   }
// })

	
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

jQuery($ => {

	var phyloDatas = loadCSV("https://github.com/ddonatien/endspe/blob/master/app/data/phylo.csv");
	console.log(phyloDatas);

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
