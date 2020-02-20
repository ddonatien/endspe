jQuery($ => {

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
