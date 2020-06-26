var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { Pool} = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'School',
  password: '20134338t',
  port: 5432,
})

/* GET home page. */
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/loginacc', function(req, res, next) {
  res.render('login');
});
/*Nhan login tu react*/
  router.post('/loginacc',urlencodedParser, function(req, res, next) {
  var login_type = req.body.login_type
  var username = req.body.username
  var password =req.body.password
  pool.query('select a_mean,username,pw,fullname from listuser',(error,response)=>{
    if(error){
      console.log(error)
    }
    else{
      loginAccount=response.rows.filter((el)=>el.a_mean===login_type&&el.username===username&&el.pw===password)
      console.log(loginAccount[0])
      if(loginAccount.length===0){
        console.log('Ban da nhap sai mk')
        res.send('Ban da nhap sai mk')
      }
      else {
        res.send(loginAccount[0]);
      }
    }
  })
 
});

/*lay data listuser cho react*/
router.get('/getdata', function(req, res, next) {
  console.log('day la api lay du lieu teacher cho react js')
  pool.query('select listuser.username, fullname, i_mean, a_mean, scheduler.c_mean, first_name from listuser left join scheduler on listuser.username=scheduler.username order by 6',(error,response)=>{
    if(error){
      console.log(error)
    }
    else{
      res.send(response.rows)
    } 
    //pool.end();
  })
})
/*lay list vien cho react*/
router.get('/getlistvien', function(req, res, next) {
  pool.query('select * from institute',(error,response)=>{
    if(error){
      console.log(error)
    }
    else{
      res.send(response.rows)
    } 
  })
})
/*lay list time cho react*/
router.get('/gettime', function(req, res, next) {
  pool.query('select * from  timelist',(error,response)=>{
    if(error){
      console.log(error)
    }
    else{
      res.send(response.rows)
    } 
  })
})
/**phan add them teacher or student*/
router.get('/addnew', function(req, res, next) {
  res.render('addnew');
});
router.post('/addnew',urlencodedParser, function(req, res, next) {
  var firstname = req.body.firstname
  var username = req.body.username
  var pw = req.body.password
  var fullname = req.body.fullname
  var institute = req.body.institute
  var authority = req.body.authority
  pool.query('insert into listuser(username,pw,fullname,a_mean,i_mean,first_name) values ($1,$2,$3,$4,$5,$6)',[username,pw,fullname,authority,institute,firstname],(error,response)=>{
    if(error){
      console.log(error)
    }
    else{
      res.send(response.rows)
    }
  })
  
})
/*add new class*/
router.get('/addnewclass', function(req, res, next) {
  res.render('addnewclass');
});
router.post('/addnewclass',urlencodedParser, function(req, res, next) {
  console.log(req.body.institute)
  console.log(req.body.idclass)
  console.log(req.body.classname)
  console.log(req.body.day)
  console.log(req.body.starttime)
  console.log(req.body.endtime)
  var institute=(req.body.institute)
  var idclass=(req.body.idclass)
  var classname = (req.body.classname)
  var day = (req.body.day)
  var starttime = (req.body.starttime)
  var endtime = (req.body.endtime)
  pool.query('insert into classlist(c_mean,i_mean,starttime,endtime,thu,c_name) values ($1,$2,$3,$4,$5,$6)',[classname,institute,starttime,endtime,day,idclass],(error,response)=>{
    if(error){
      console.log(error)
    }
    else{
      res.send(response.rows)
    }
  })

  
  // var username = req.body.username
  // var pw = req.body.password
  // var fullname = req.body.fullname
  // var institute = req.body.institute
  // var authority = req.body.authority
  // pool.query('insert into listuser(username,pw,fullname,a_mean,i_mean,first_name) values ($1,$2,$3,$4,$5,$6)',[username,pw,fullname,authority,institute,firstname],(error,response)=>{
  //   if(error){
  //     console.log(error)
  //   }
  //   else{
  //     res.send(response.rows)
  //   }
  // })
  
})
/*lay list class cho react*/
router.get('/getdetailclasslist', function(req, res, next) {
  pool.query('select a.i_mean,a.c_name,a.c_mean,a.thu, a.starttime,a.endtime, b.username,c.fullname, c.a_mean from classlist a left join scheduler b on a.c_name=b.c_name and a.c_mean = b.c_mean and a.starttime = b.starttime left join listuser c on b.username = c.username order by 1,2',(error,response)=>{
    if(error){
      console.log(error)
    }
    else{
      res.send(response.rows)
    } 
  })
})
router.get('/getclasslist', function(req, res, next) {
  pool.query('select * from classlist',(error,response)=>{
    if(error){
      console.log(error)
    }
    else{
      res.send(response.rows)
    } 
  })
})
module.exports = router;



