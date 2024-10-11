var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.get('/api', function(req, res, next) {
  res.json({ name: 'test 1' });
});

module.exports = router;
