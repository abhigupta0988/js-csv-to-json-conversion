const fs = require('fs'); //import 'fs' or file system module of nodejs
const readline = require('readline');  //import 'readline' module of nodejs
let urb_pop_grow = {};
let urb_rur_population = {};
let year_object = {};
let asia = ['ARM','AZE','BHR','BGD','BTN','BRN','KHM','CHN','CXR','CCK','IOT','GEO','HKG','IND','IDN',
							'IRN','IRQ','ISR','JPN','JOR','KAZ','KWT','KGZ','LAO','LBN','MAC','MYS','MDV','MNG','MMR',
								'NPL','PRK','OMN','PAK','PSE','PHL','QAT','SAU','SGP','KOR','LKA','SYR','TWN','TJK','THA',
									'TUR','TKM','ARE','UZB','VNM','YEM'];
const rl = readline.createInterface({
	input: fs.createReadStream('indicators.csv') //reading file indicators.csv
});

rl.on('line', (line) => {
	line
	.split('\n')
	let line_holder = line.split(',');
	if(line_holder[1] === 'IND' && line_holder[3] === 'SP.URB.TOTL.IN.ZS'){	//comparing for urban population
		year_object[line_holder[4]] = year_object[line_holder[4]] || [];	//setting year as object
		year_object[line_holder[4]].push({
			"Urban Population (% in total)" : line_holder[5]
		});
	}
	if(line_holder[1] === 'IND' && line_holder[3] === 'SP.RUR.TOTL.ZS'){	//comparing for rural population
		year_object[line_holder[4]] = year_object[line_holder[4]] || [];	//setting year as object
		year_object[line_holder[4]].push({
			"Rural Population (% in total)" : line_holder[5]
		});
	}
	if(line_holder[1] === 'IND' && line_holder[3] === 'SP.URB.GROW'){	//comparing for urban population growth
		urb_pop_grow[line_holder[4]] = urb_pop_grow[line_holder[4]] || [];	//setting year as object
		urb_pop_grow[line_holder[4]].push({
			"Urban population growth(annual %)" : line_holder[5]
		});
	}
	if((asia.find(x => x === line_holder[1]) != undefined)){	//comparing for countries in asia and total population
		if(line_holder[line_holder.length-3] === 'SP.POP.TOTL'){
			urb_rur_population[line_holder[line_holder.length-2]] 
				= urb_rur_population[line_holder[line_holder.length-2]] || [];	//setting year as object
			urb_rur_population[line_holder[line_holder.length-2]].push({
				"country name" : line_holder[0],
				"Urban Population + Rural Population" : line_holder[line_holder.length-1]
			});
		}
	}
})
.on('close', () => {
	fs.createWriteStream('asia-total-pop.json')						
		.write(JSON.stringify(urb_rur_population,null,2));	//writing urb_rur_populationto asia-total-pop.json*/
	fs.createWriteStream('urb-rur-total-pop.json')
		.write(JSON.stringify(year_object,null,2));;	//writing year_object to urb-rur-total-pop.json
	fs.createWriteStream('urb-pop-growth.json')
		.write(JSON.stringify(urb_pop_grow,null,2));	//writing urb_pop_grow to urb-pop-growth.json
	console.log('Created file\n1. urb-rur-total-pop.json\n2. urb-pop-growth.json\n3. asia-total-pop.json');
});
