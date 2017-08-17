let fs = require('fs');
let main = {};
let MaindataReader = fs.createReadStream('indicators.csv');
let MaindataWriter = fs.createWriteStream('india.json');
MaindataReader.setEncoding('UTF-8');

MaindataReader.on('data', function(chunk) {
	let data;
	data += chunk;
	data.trim()
	.split('\n')
	.map(line => line.split('\t'))
	.reduce((main1,line) => {
		let Element = line[0].split(",");
		if(Element[1] == "IND") {
			if(Element[Element.length - 3] == "SP.URB.TOTL.IN.ZS" ) {
				main[Element[Element.length - 2]] = main[Element[Element.length - 2]] || [];
				main[Element[Element.length - 2]].push({
					CountryCode : Element[1],
					"Birth rate, crude (per 1,000 people)" : Element[Element.length - 1]
				}) 
			} else if(Element[Element.length - 3] == "SP.DYN.CDRT.IN") {
				main[Element[Element.length - 2]] = main[Element[Element.length - 2]] || [];
				main[Element[Element.length - 2]].push({
					CountryCode : Element[1],
					"Death rate, crude (per 1,000 people)" : Element[Element.length - 1]
				}) 
			}
		}
		return main1;
	},{})
})
MaindataReader.on('end',function() {
	MaindataWriter.write(JSON.stringify(main,null,2),'UTF-8');
});