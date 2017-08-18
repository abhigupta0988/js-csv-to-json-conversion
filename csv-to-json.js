const readline = require('readline');
const fs = require('fs');
var year_object = {};
var urb_pop_grow = {};
var write_to_json_urban = fs.createWriteStream('urb-rur-total-pop.json');
var write_to_json_urb_pop = fs.createWriteStream('urb-pop-growth.json');
const rl = readline.createInterface({
  input: fs.createReadStream('indicators.csv')
});

rl.on('line', (line) => {
  line
  .split('\n')
  var arr = line.split(',')
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
}).on('close', () => {
  write_to_json_urban.write(JSON.stringify(year_object,null,2),'UTF-8');
  write_to_json_urb_pop.write(JSON.stringify(urb_pop_grow,null,2),'UTF-8');
});
