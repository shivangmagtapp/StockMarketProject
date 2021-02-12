var fs = require('fs'); 
var parse = require('csv-parse');
var Papa = require("papaparse")
var stringify = require('csv-stringify');
const CSV = require('csv-string');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var csvData=[];

fs.createReadStream("../ind_nifty50list.csv")
    .pipe(parse({delimiter: ':'}))
    .on('data', function(csvrow) {
        
        csvData.push(csvrow)
    })
    .on('end',async function() {
      //do something with csvData
      var comp_symbols=[]
      for(var i=0;i<csvData.length;i++){
        comp_symbols.push(csvData[i][0].split(",")[2])
      }
      console.log(comp_symbols)
      var csvData2 = []
      var csvData3 = []
      var tokens = []
      var dataArray = []
      var appendThis = []
      var i=0
        fs.createReadStream("../symbols.csv")
        .pipe(parse({delimiter: ':'}))
        .on('data',async function(csvrow) {
            var dd = csvrow[0].split(",")
            csvData2.push(dd)
        }).on('end',async function() {
        stringify(csvData2, function(err, output){
        var a= Papa.parse(output, {header:true}).data
            function findEmailByName(name) {
                return a.filter(data => data.tradingsymbol === name)[0].instrument_token
            }
            for(var i=1;i<comp_symbols.length;i++){
                   tokens.push(findEmailByName(comp_symbols[i]))
            }
            console.log(tokens)
            fs.createReadStream("../ind_nifty50list.csv")
            .pipe(parse({delimiter: ':'}))
            .on('data',async function(csvrow) {
                var dd = csvrow[0].split(",")
                csvData3.push(dd)
                
            }).on('end',async function() {
                for(var i=0;i<csvData3.length;i++){
                    if(i==0){
                        csvData3[i].push("Instrument Token")
                    }
                    else{
                   csvData3[i].push(tokens[i-1])
                    }
                }
                var data=csvData3.join("\n")
                
                fs.writeFile("../ind_nifty50list2.csv", data, function (err) {
                    if (err) return console.log(err);
                    console.log('File Updated!');
                  });
                
            })
           
        })
        
        
        
      
      })
            
            
    
    
    
    });

    