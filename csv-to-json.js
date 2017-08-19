const readline = require('readline');
const fs = require('fs');
let year_object = {};
let urb_pop_grow = {};
let urb_rur_population = {};
let asia = ['ARM','AZE','BHR','BGD','BTN','BRN','KHM','CHN','CXR','CCK','IOT','GEO','HKG','IND','IDN','IRN','IRQ','ISR',
		'JPN','JOR','KAZ','KWT','KGZ','LAO','LBN','MAC','MYS','MDV','MNG','MMR','NPL','PRK','OMN','PAK','PSE','PHL',
			'QAT','SAU','SGP','KOR','LKA','SYR','TWN','TJK','THA','TUR','TKM','ARE','UZB','VNM','YEM'];
let urb_pop;
let rur_pop;
let write_to_json_asia = fs.createWriteStream('asia-total-pop.json');
let write_to_json_urban = fs.createWriteStream('urb-rur-total-pop.json');
let write_to_json_urb_pop = fs.createWriteStream('urb-pop-growth.json');
const rl = readline.createInterface({
  input: fs.createReadStream('indicators.csv')
});

rl.on('line', (line) => {
  line
  .split('\n')
  let line_holder = line.split(',')
  if(line_holder[1] === 'IND' && line_holder[3] === 'SP.URB.TOTL.IN.ZS'){
			year_object[line_holder[4]] = year_object[line_holder[4]] || [];	
					year_object[line_holder[4]].push({
						"Urban Population (% in total)" : line_holder[5]
					});
  }
 	if(line_holder[1] === 'IND' && line_holder[3] === 'SP.RUR.TOTL.ZS'){
			year_object[line_holder[4]] = year_object[line_holder[4]] || [];		
					year_object[line_holder[4]].push({
						"Rural Population (% in total)" : line_holder[5]
					});

  }
  if(line_holder[1] === 'IND' && line_holder[3] === 'SP.URB.GROW'){
			urb_pop_grow[line_holder[4]] = urb_pop_grow[line_holder[4]] || [];	
					urb_pop_grow[line_holder[4]].push({
						"Urban population growth(annual %)" : line_holder[5]
					});
	}
	if((asia.find(x => x === line_holder[1]) != undefined)){
		if(line_holder[line_holder.length-3] === 'SP.POP.TOTL'){
			urb_rur_population[line_holder[line_holder.length-2]] = urb_rur_population[line_holder[line_holder.length-2]] || [];
			urb_rur_population[line_holder[line_holder.length-2]].push({
						"country name" : line_holder[0],
						"Country" : line_holder[1],
						"Urban Population + Rural Population" : line_holder[line_holder.length-1]
					});
		}
	}
}).on('close', () => {
  write_to_json_urban.write(JSON.stringify(year_object,null,2),'UTF-8');
  write_to_json_urb_pop.write(JSON.stringify(urb_pop_grow,null,2),'UTF-8');
  write_to_json_asia.write(JSON.stringify(urb_rur_population,null,2),'UTF-8');
});
