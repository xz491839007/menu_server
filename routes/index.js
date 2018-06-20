var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getjson',function (req,res,next) {
  res.json({
      status:1,
      message:'获取成功'
  })
});

module.exports = router;
