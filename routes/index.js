var express = require('express');
var router = express.Router();
var shell = require('shelljs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cookobot' });
});

router.post('/', (req, res) => {
  console.log(req.body);
  res.send(200);
  shell.echo('hello world');
  //shell.exec('roscore')
});

module.exports = router;