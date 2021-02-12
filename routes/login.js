var axios = require("axios")
var config = require("../config/key.js")
var KiteConnect = require("kiteconnect").KiteConnect;
var kc = new KiteConnect({
	api_key: config.api_key
});
// -H "X-Kite-Version: 3" \
// -d "api_key=xxx" \
// -d "request_token=yyy" \
// -d "checksum=zzz"
// api_key = "n27ywvp2919267ll"
// api_secret = "4xeei20u5zxgkixbi6wid6p2yb1lq8h0"
// username = "KM6948"
// password = "AesFhe123$"
// pin = "196930"

axios.get("https://kite.trade/connect/login?v=3&api_key="+config.api_key,
{
  headers: {
    'Cache-Control': "no-cache",
    'Accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    'User-Agent':"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
  }
}) 
.then(function (response) {
    console.log(response)
    console.log(response.request.path);
    var req_token = (response.request.path).toString().split("=")[2]
    console.log(req_token)
    kc.generateSession("", config.api_secret)
    .then(function(response) {
      console.log(response)
      init();
    })
    .catch(function(err) {
      console.log(err);
    });
  
  function init() {
    // Fetch equity margins.
    // You can have other api calls here.
    kc.getMargins()
      .then(function(response) {
        // You got user's margin details.
      }).catch(function(err) {
        // Something went wrong.
      });
  }
})
.catch(function(err) {
  console.log(err);
});

  