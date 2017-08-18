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
  let arr = line.split(',')
  if(arr[1] === 'IND' && arr[3] === 'SP.URB.TOTL.IN.ZS'){
			year_object[arr[4]] = year_object[arr[4]] || [];	
					year_object[arr[4]].push({
						"Urban Population (% in total)" : arr[5]
					});
  }
 	if(arr[1] === 'IND' && arr[3] === 'SP.RUR.TOTL.ZS'){
			year_object[arr[4]] = year_object[arr[4]] || [];		
					year_object[arr[4]].push({
						"Rural Population (% in total)" : arr[5]
					});

  }
  if(arr[1] === 'IND' && arr[3] === 'SP.URB.GROW'){
			urb_pop_grow[arr[4]] = urb_pop_grow[arr[4]] || [];	
					urb_pop_grow[arr[4]].push({
						"Urban population growth(annual %)" : arr[5]
					});
	}
	if(asia.find(x => x == arr[1]) != undefined){
		if(arr[arr.length-3] == 'SP.URB.TOTL'){
			urb_pop = parseFloat(arr[arr.length-1]);
		}
		if(arr[arr.length-3] == 'SP.RUR.TOTL'){
			rur_pop = parseFloat(arr[arr.length-1]);
		}
		urb_pop += rur_pop;
		urb_rur_population[arr[0]] = urb_rur_population[arr[0]] || [];	
					urb_rur_population[arr[0]].push({
						"Year" : arr[arr.length-2],
						"Urban Population + Rural Population" : urb_pop
					});
	}
}).on('close', () => {
  write_to_json_urban.write(JSON.stringify(year_object,null,2),'UTF-8');
  write_to_json_urb_pop.write(JSON.stringify(urb_pop_grow,null,2),'UTF-8');
  write_to_json_asia.write(JSON.stringify(urb_rur_population,null,2),'UTF-8');
});
