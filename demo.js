const readline = require('readline');
const fs = require('fs');
let year_object = {};
let write_to_json = fs.createWriteStream('urban.json');
const rl = readline.createInterface({
  input: fs.createReadStream('indicators.csv')
});

rl.on('line', (line) => {
  line
  .split('\n')
  var arr = line.split(',')
  if(arr[1] === 'IND' && arr[3] === 'SP.URB.TOTL.IN.ZS'){
		 let temp = [
    						{ 'year': arr[4] },
    						{ 'value': arr[5] }
			];
			year_object[temp[0]] = year_object[temp[0]] || [];
				year_object[temp[1]].push({
					"Urban total Population " : temp[1]
					}) 

 			

  }
  rl.on('end',function() {
	write_to_json.write(JSON.stringify(year_object,null,2),'UTF-8');
});








  	

});