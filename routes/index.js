var express = require('express');
var router = express.Router();

var fs = require("fs")
/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readFile('./ind_nifty50list3.csv', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
  res.render('index', { title: 'Express', data:data });
});
});

module.exports = router;
