var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	// res.render('index', { title: 'Express' });
	// res.render('index', { title: 'Express', animal: req.query.animal });
	res.sendFile(__dirname + '/public/index.html');
});

module.exports = router;