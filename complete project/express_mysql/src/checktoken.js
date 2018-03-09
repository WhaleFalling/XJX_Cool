const router=require('express').Router();
const url=require("url");
const async=require("async");
const bodyParser=require("body-parser");
const query=require("./base/db_handle");
const op = require('./base/HttpOutput');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use("/",async (req,res,next)=>{
    var token=req.query.token||req.body.token;
    var sql_str = `select * from test.managers where token = "${token}"`;
    await query(sql_str).then((result)=>{
        if(result.length>0){
            req.boo = true;
            next();
        }else{
            req.boo = false;
            next();
        }
    }).catch((err)=>{
        op(res).json(err).internal_error().send();
    })
    
})

module.exports = router;