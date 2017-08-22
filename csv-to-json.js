const fs = require('fs'); //import 'fs' or file system module of nodejs
const readline = require('readline');  //import 'readline' module of nodejs
let urb_pop_grow = {}, urb_rur_population = {}, year_object = {};
let count = 1,index = [];
let asia = ['ARM','AZE','BHR','BGD','BTN','BRN','KHM','CHN','CXR','CCK','IOT','GEO','HKG','IND','IDN','IRN','IRQ','ISR','JPN','JOR','KAZ','KWT','KGZ','LAO','LBN','MAC','MYS','MDV','MNG','MMR','NPL','PRK','OMN','PAK','PSE','PHL','QAT','SAU','SGP','KOR','LKA','SYR','TWN','TJK','THA','TUR','TKM','ARE','UZB','VNM','YEM'];

const rl = readline.createInterface({
	input: fs.createReadStream('indicators.csv') //reading file indicators.csv
});

rl.on('line', (line) => {
	line
	.split('\n')
	let line_holder = line.match(/"[^"]+"|[^,]+/g); //regex for ignoring commas inside double codes
	if(count == 1){		
		index['Year'] = line_holder.indexOf('Year');
		index['CountryName'] = line_holder.indexOf('CountryName');
		index['IndicatorCode'] = line_holder.indexOf('IndicatorCode');
		index['Value'] = line_holder.indexOf('Value');
		index['CountryCode'] = line_holder.indexOf('CountryCode');
		count--;
	}
	if(line_holder[1] === 'IND' && line_holder[index['IndicatorCode']] === 'SP.URB.TOTL.IN.ZS'){	//comparing for urban population
		year_object[line_holder[index['Year']]] = year_object[line_holder[index['Year']]] || [];	//setting year as object
		year_object[line_holder[index['Year']]].push({
			"Urban Population (% in total)" : parseFloat(line_holder[index['Value']])
		});
	}
	if(line_holder[1] === 'IND' && line_holder[index['IndicatorCode']] === 'SP.RUR.TOTL.ZS'){	//comparing for rural population
		year_object[line_holder[index['Year']]] = year_object[line_holder[index['Year']]] || [];	//setting year as object
		year_object[line_holder[index['Year']]].push({
			"Rural Population (% in total)" : parseFloat(line_holder[index['Value']])
		});
	}
	if(line_holder[1] === 'IND' && line_holder[index['IndicatorCode']] === 'SP.URB.GROW'){	//comparing for urban population growth
		urb_pop_grow[line_holder[index['Year']]] = urb_pop_grow[line_holder[index['Year']]] || [];	//setting year as object
		urb_pop_grow[line_holder[index['Year']]].push({
			"Urban population growth(annual %)" : parseFloat(line_holder[index['Value']])
		});
	}
	if((asia.find(x => x === line_holder[1]) != undefined)){	//comparing for countries in asia and total population
		if(line_holder[index['IndicatorCode']] === 'SP.POP.TOTL'){
			urb_rur_population[line_holder[index['Year']]] 
				= urb_rur_population[line_holder[index['Year']]] || [];	//setting year as object
			urb_rur_population[line_holder[index['Year']]].push({
				"country name" : line_holder[index['CountryName']].replace(/\"/g , ""), //replace "abc" to abc
				"Urban Population + Rural Population" : parseInt(line_holder[index['Value']])
			});
		}
	}
})
.on('close', () => {
	fs.createWriteStream('urb-rur-total-pop.json').write(JSON.stringify(year_object,null,2)); //writing year_object to urb-rur-total-pop.json
	fs.createWriteStream('urb-pop-growth.json').write(JSON.stringify(urb_pop_grow,null,2));	//writing urb_pop_grow to urb-pop-growth.json
	fs.createWriteStream('asia-total-pop.json').write(JSON.stringify(urb_rur_population,null,2));	//writing urb_rur_population to asia-total-pop.json
	console.log('Created file\n1. urb-rur-total-pop.json\n2. urb-pop-growth.json\n3. asia-total-pop.json');
});