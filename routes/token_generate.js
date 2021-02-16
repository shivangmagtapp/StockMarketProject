// Include the chrome driver 
var cron = require('node-cron');
cron.schedule('* */12 * * *', function(){
require("chromedriver"); 
var fs = require("fs") 
var config = require("../config/key.js")
var KiteConnect = require("kiteconnect").KiteConnect;
var kc = new KiteConnect({
	api_key: config.api_key
});
// Include selenium webdriver 
let swd = require("selenium-webdriver"); 
const chrome = require('selenium-webdriver/chrome');
let browser = new swd.Builder(); 
const screen = {
    width: 640,
    height: 480
  };
let tab = browser.forBrowser("chrome").setChromeOptions(new chrome.Options().headless().windowSize(screen)).build(); 

// Get the credentials from the JSON file 
let username = config.username
let password = config.password
let pin = config.pin

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  

let tabToOpen = 
	tab.get("https://kite.trade/connect/login?v=3&api_key="+config.api_key); 
tabToOpen 
	.then(function () { 

		// Timeout to wait if connection is slow 
		let findTimeOutP = 
			tab.manage().setTimeouts({ 
				implicit: 10000, // 10 seconds 
			}); 
		return findTimeOutP; 
	}) 
	.then(function () { 

		// Step 2 - Finding the username input 
		let promiseUsernameBox = 
			tab.findElement(swd.By.xpath('//input[@type="text"]'))
		return promiseUsernameBox; 
	}) 
	.then(function (usernameBox) { 

		// Step 3 - Entering the username 
		let promiseFillUsername = 
			usernameBox.sendKeys(username); 
		return promiseFillUsername; 
	}) 
	.then(function () { 
		console.log( 
			"Username entered successfully"
		); 

		// Step 4 - Finding the password input 
		let promisePasswordBox = 
			tab.findElement(swd.By.xpath('//input[@type="password"]')); 
		return promisePasswordBox; 
	}) 
	.then(function (passwordBox) { 

		// Step 5 - Entering the password 
		let promiseFillPassword = 
			passwordBox.sendKeys(password); 
		return promiseFillPassword; 
	}) 
	.then(async function () { 
		console.log( 
			"Password entered successfully"
		); 
		// Step 6 - Finding the Sign In button 
		let promiseSignInBtn = tab.findElement( 
			swd.By.xpath('//button[@type="submit"]') 
		); 
		return promiseSignInBtn; 
	}) 
	.then(function (signInBtn) { 

		// Step 7 - Clicking the Sign In button 
		let promiseClickSignIn = signInBtn.click(); 
		return promiseClickSignIn; 
	}) 
	.then(async function () { 
		console.log("Successfully signed in!");
        await sleep(10000);
        let promisepin = tab.findElement( 
			swd.By.xpath('//input[@type="password"]') 
		); 
		return promisepin;
	})
    .then(async function(promisepin){
        let promiseFillPin = promisepin.sendKeys(pin); 
        return promiseFillPin
    }).then(function(){

        let promiseSignInPinBtn = tab.findElement( 
			swd.By.xpath('//button[@type="submit"]') 
		);  
		return promiseSignInPinBtn;
    })
    .then(async function(signbutton){
        let signbut = signbutton.click(); 
		return signbut; 
    })
    .then(async function(success){
        await sleep(10000);
        await tab.getCurrentUrl().then(async function(url){
            var req_token = (url).toString().split("=")[1]
            tab.close()
            console.log(url)
            req_token=req_token.split("&")[0]
            console.log(req_token)
            kc.generateSession(req_token, config.api_secret)
            .then(function(response) {
                console.log(response)
				  fs.writeFile('../config/token.txt',response.access_token, function (err) {
					if (err) return console.log(err);
					console.log('Token Updated!');
				  });
                
            })
            .catch(function(err) {
                console.log(err);
            });
        })
    })
	.catch(function (err) { 
		console.log("Error ", err, " occurred!"); 
	});
}); 
