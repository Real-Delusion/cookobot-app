var express = require('express');
var router = express.Router();
var shell = require('shelljs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cookobot' });
});

router.post('/', (req, res) => {
  let table = req.body.table;
  console.log(table);
  res.send(200);
  shell.echo('Go to table '+table);
  shell.exec('rosservice call /navegacion_autonoma_servicio mesa='+table);
});

module.exports = router;