var KiteConnect = require("kiteconnect").KiteConnect;
var config = require("../config/key.js")
var KiteTicker = require("kiteconnect").KiteTicker;

var ticker = new KiteTicker({
	api_key: config.api_key,
	access_token: config.token
});

// set autoreconnect with 10 maximum reconnections and 5 second interval
ticker.autoReconnect(true, 10, 5)
ticker.connect();
ticker.on("ticks", onTicks);
ticker.on("connect", subscribe);

ticker.on("noreconnect", function() {
	console.log("noreconnect");
});
try{
ticker.on("reconnecting", function(reconnect_interval, reconnections) {
	console.log("Reconnecting: attempt - ", reconnections, " innterval - ", reconnect_interval);
});
}
catch(err){
    console.log(err)
}
function onTicks(ticks) {
	console.log("Ticks", ticks);
}

function subscribe() {
	var items = [738561];
	ticker.subscribe(items);
	ticker.setMode(ticker.modeFull, items);
}