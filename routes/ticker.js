var KiteTicker = require("kiteconnect").KiteTicker;
var fs = require("fs")
var parse = require('csv-parse');
var key = require("../config/key.js")
var ticker = new KiteTicker({
	api_key: key.api_key,
	access_token: key.token
});

// set autoreconnect with 10 maximum reconnections and 5 second interval
ticker.autoReconnect(true, 10, 5)
ticker.connect();
ticker.on("ticks", onTicks);
ticker.on("connect", subscribe);

ticker.on("noreconnect", function() {
	console.log("noreconnect");
});

ticker.on("reconnecting", function(reconnect_interval, reconnections) {
	console.log("Reconnecting: attempt - ", reconnections, " innterval - ", reconnect_interval);
});

function onTicks(ticks) {
	console.log("Ticks", ticks);
}

function subscribe() {
    var csvData=[]
    fs.createReadStream("../ind_nifty50list2.csv")
    .pipe(parse({delimiter: ':'}))
    .on('data', function(csvrow) {
        var s = csvrow.toString().split(",")[5]
        csvData.push(parseInt(s))
    })
    .on('end',async function() {
      csvData.shift()
      console.log(csvData)
	var items = csvData;
	ticker.subscribe(items);
	ticker.setMode(ticker.modeFull, items);
});
}