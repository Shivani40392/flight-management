var mysql=require("mysql2")
var pool=mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    password:'shivanigupta',
    database:'flight78',

})
module.exports=pool