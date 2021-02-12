var axios = require("axios")
var config = require("../config/key.js")
var cred = require("../config/client_secret.json")
var cron = require('node-cron');
const {promisify} = require("util")
const { GoogleSpreadsheet } = require('google-spreadsheet');
var previous_date = (new Date().getDate()-3).toString()
var current_date = (new Date().getDate()).toString()
var current_month = (new Date().getMonth()+1).toString()
var current_year = new Date().getFullYear()
var hour = new Date().getHours().toString()
var minutes = new Date().getMinutes().toString()
var fs = require("fs")
var parse = require('csv-parse');
const doc = new GoogleSpreadsheet(config.GoogleSpreadsheetID);
if(hour.length==1){
  hour= "0"+hour
}
if(previous_date.length==1){
  previous_date= "0"+previous_date
}
if(current_date.length==1){
  current_date= "0"+current_date
}
if(current_month.length==1){
  current_month= "0"+current_month
}
if(minutes.length==1){
  minutes= "0"+minutes
}
var csvData3=[]

var from = current_year+"-"+current_month+"-"+current_date+"+"+"09"+":"+"30"+":00"
var to = current_year+"-"+current_month+"-"+current_date+"+"+"15"+":"+"35"+":00"
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  
function delay() {
  return new Promise(resolve => setTimeout(resolve, 300));
}
doc.useServiceAccountAuth({
  client_email: cred.client_email ,
  private_key: cred.private_key,
}).then(async function(){
    await doc.loadInfo();
    const sheet=doc.sheetsByIndex[0]
  
    sheet.headerValues=['Company_Name', 'Industry','Symbol','Series', 'ISIN_Code','Open', 'High', 'Low','Close', 'Volume'];
    var csvData = []
  fs.createReadStream("../ind_nifty50list2.csv")
    .pipe(parse({delimiter: ':'}))
    .on('data', function(csvrow) {
        csvData.push(csvrow)
    })
    .on('end',async function() {
    cron.schedule('*/5 * * * *', function(){
      historical(sheet, csvData)
    });
    
  })
})





async function historical(sheet, csvData){
  var arr=[]
  csvData3 = []
  for(var i=1;i<csvData.length;i++){
    await axios.get("https://api.kite.trade/instruments/historical/"+csvData[i][0].split(",")[5]+"/5minute?from="+from+"&"+"to="+to,
      {
      headers: {    'X-Kite-Version': 3,
        Authorization: 'token '+config.api_key+":"+config.token
      }
      }) 
      .then(async function (response) {
      arr.push([response.data.data.candles[response.data.data.candles.length-1][1],response.data.data.candles[response.data.data.candles.length-1][2]
      ,response.data.data.candles[response.data.data.candles.length-1][3],response.data.data.candles[response.data.data.candles.length-1][4],
      response.data.data.candles[response.data.data.candles.length-1][5]])
      console.log(arr)
      console.log(arr.length)
      // await sheet.loadCells('F1:J60');
        // await updateCells(sheet,i,response);
        
        
        
      }).catch(function (err) { 
        arr.push(['','','','',''])
        console.log("Error ", err, " occurred!"); 
      });
      
      
      }
      console.log(arr)
      CSVDataEntry(arr, sheet)

      
}

function CSVDataEntry(arr, sheet){
  sheet.clear()
  fs.createReadStream("../ind_nifty50list.csv")
            .pipe(parse({delimiter: ':'}))
            .on('data',async function(csvrow) {
                var dd = csvrow[0].split(",")
                csvData3.push(dd)
                
            }).on('end',async function() {
                for(var i=0;i<csvData3.length;i++){
                  
                    if(i==0){
                        csvData3[i].push("Open")
                        csvData3[i].push("High")
                        csvData3[i].push("Low")
                        csvData3[i].push("Close")
                        csvData3[i].push("Volume")
                    }
                    else{
                        csvData3[i].push(arr[i-1][0])
                        csvData3[i].push(arr[i-1][1])
                        csvData3[i].push(arr[i-1][2])
                        csvData3[i].push(arr[i-1][3])
                        csvData3[i].push(arr[i-1][4])
                    }
                }
                var data=csvData3.join("\n")
                var csvData4 = []
                try{
                fs.writeFile("../ind_nifty50list3.csv", data, function (err) {
                    if (err) return console.log(err);
                    // fs.createReadStream("../ind_nifty50list3.csv")
                    // .pipe(parse({delimiter: ':'}))
                    // .on('data',async function(csvrow) {
                    //     var dd = csvrow[0].split(",")
                    //     csvData4.push(dd)
                    //     console.log(csvData4)
                    // }).on('end',async function() {
                    //   for(var i=0;i<csvData4.length;i++){
                    //     await sleep(100)
                    //     await sheet.addRow({ Company_Name: csvData4[i][0], Industry: csvData4[i][1], Symbol: csvData4[i][2], Series:csvData4[i][3], ISIN_Code:csvData4[i][4],
                    //     Open:csvData4[i][5], High:csvData4[i][6], Low:csvData4[i][7], Close:csvData4[i][8], Volume:csvData4[i][9]});
                    //   }
                    //   
                    // })
                    // sheet.copyToSpreadSheet("../ind_nifty50list3.csv")
                    console.log('File Updated!');
                  })
                }
                catch(err){
                  console.log(err)
                }
            })
}



