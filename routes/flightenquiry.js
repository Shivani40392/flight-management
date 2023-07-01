var express = require('express');
var pool = require('./pool');
var router = express.Router();
var upload = require('./multer')

var LocalStorage=require('node-localstorage').LocalStorage
localStorage=new LocalStorage('./scratch');

router.get('/flightinterface', function (req, res) {
    admin=JSON.parse(localStorage.getItem('ADMIN'))
    if(admin)
    {
    res.render('flightinterface', { message: '' });
    }
    else
    {
        res.render('adminlogin2',{message:''})
    }
});
router.get('/loginpage',function(req,res){
    res.render('loginpage')
})

router.post('/flightsubmit', upload.single('logo'), function (req, res) {
    
    var days = ("" + req.body.days).replaceAll("'", '"')
    pool.query("insert into flightsdetails(flightname, flighttype, totalseats, days, sourcecity, departuretime, destinationcity, arrivaltime, company, logo)values(?,?,?,?,?,?,?,?,?,?)", [req.body.flightname, req.body.flighttype, req.body.seats, days, req.body.source, req.body.depttime, req.body.destination, req.body.arrtime, req.body.company, req.file.originalname], function (error, result) {

        if (error) {
            console.log(error)
            res.render('flightinterface', { 'message': 'server error' })

        }
        else {
            res.render('flightinterface', { 'message': 'Record Successfully submitted' })
        }
    })
})
router.get('/fetchallcities', function (req, res) {
    pool.query('Select * from cities', function (error, result) {
        if (error) {
            res.status(500).json({ result: [], message: 'error' })
        }
        else {
            res.status(200).json({ result: result, message: 'success' })
        }
    })
})


router.get('/displayallrecords', function (req, res) {
  
    admin=JSON.parse(localStorage.getItem('ADMIN')) 
      if(!admin){
        res.render('adminlogin2',{message:''})
      } 
      else{
    pool.query('select F.*,(select C.cityname from cities as C where C.cityid=F.sourcecity)as source,(select C.cityname from cities as C where C.cityid=F.destinationcity)as destination from flightsdetails as F ', function (error, result) {

        if (error) {
            res.render('displayallrecords', { data: [], message: error })
        }
        else {
            res.render('displayallrecords', { data: result, message: 'success' })
        }
    })
    }

})

router.get('/searchbyid', function (req, res) {
    pool.query('select F.*,(select C.cityname from cities as C where C.cityid=F.sourcecity)as source,(select C.cityname from cities as C where C.cityid=F.destinationcity)as destination from flightsdetails as F  where flightid=?', [req.query.fid], function (error, result) {

        if (error) {
            res.render('flightinterfaceupdate', { data: [], message: error })
        }
        else {
            res.render('flightinterfaceupdate', { 'data': result[0], 'message': 'success' })

        }
    })

})
router.post('/flight_edit_delete', function (req, res) {
   
    
         if(req.body.btn=='edit')
         {  
            
            var days = ("" + req.body.days).replaceAll("'", '"')
            pool.query("Update flightsdetails set flightname=?, flighttype=?, totalseats=?, days=?, sourcecity=?, departuretime=?, destinationcity=?, arrivaltime=?, company=? where flightid=?", [req.body.flightname, req.body.flighttype, req.body.seats, days, req.body.source, req.body.depttime, req.body.destination, req.body.arrtime, req.body.company,req.body.flightid], function (error, result) {
            if(error){
                res.redirect('/flight/displayallrecords')


        }
        else {
            
            res.redirect('/flight/displayallrecords')
        }
       })
       }
    else 
       {
            
            pool.query("delete from flightsdetails  where flightid=?", [req.body.flightid], function (error, result) {
            if(error){
              
                res.redirect('/flight/displayallrecords')

        }
        else {
            
            res.redirect('/flight/displayallrecords')

        }
    })
       }
        
   
})
router.get('/searchbyidforimage', function (req, res) {
    pool.query('select F.* from flightsdetails as F  where flightid=?', [req.query.fid], function (error, result) {

        if (error) {
            res.render('showimages', { 'data': [], message: error })
        }
        else {
            res.render('showimages', { 'data': result[0], 'message': 'success' })

        }
    })

})
router.post('/editimage',upload.single('logo'), function (req, res) {
   
    
   
       pool.query("Update flightsdetails set logo=? where flightid=?", [req.file.originalname,req.body.flightid], function (error, result) {
       if(error){
           res.redirect('/flight/displayallrecords')


   }
   else {
       
       res.redirect('/flight/displayallrecords')
   }
  })
  

})


module.exports = router;