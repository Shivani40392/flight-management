var express = require('express');
const pool = require('./pool');
var router = express.Router();

var LocalStorage=require('node-localstorage').LocalStorage
localStorage=new LocalStorage('./scratch');
router.get('/adminlogin', function(req, res,) {
  res.render('adminlogin2',{message:''});
});

router.get('/adminlogout', function(req, res,) {
  localStorage.clear();
  res.render('adminlogin2',{message:''});
});

router.post('/chkadminpassword', function(req, res,) {
  pool.query('select * from administrator where (emailid=? or mobileno=?) and password=?',[req.body.email_mobile,req.body.email_mobile,req.body.pwd],function(error,result){
    if(error)
    {

      res.render('adminlogin2',{message:"Server error"})
    }
    else
    {
      if(result.length==1)
      { 
        localStorage.setItem("ADMIN",JSON.stringify(result[0]))
        res.render('dashboard',{data:result[0]})
      }
      else{
        res.render('adminlogin2',{message:"Invaild emailid/mobileno/password"})
      }
    }
  })
  
});
router.get('/adminlogin2', function(req, res,) {
  res.render('adminlogin',{message:''});
});

module.exports = router;
