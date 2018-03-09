const router = require('express').Router();
const url = require("url");
const async = require("async");
const query = require("./base/db_handle");
const op = require('./base/HttpOutput');
const uuid = require("uuid");

router.post('/login', async (req,res)=>{
    var {user_id,password} = req.body;
    sql_str = `select * from managers where user_id="${user_id}" and password="${password}"`;
    await query(sql_str).then((result)=>{
        if(result.length==1){
            let token=uuid();
            sql_settoken = `update managers set token="${token}" where user_id="${user_id}"`;
            query(sql_settoken).then((result)=>{
                op(res).json({token:token}).send();
            }).catch((err)=>{
                op(res).json(err).internal_error().send();
            })
        }else{
            var token=401;
            op(res).json({token:token}).send();
        }
    }).catch((err)=>{
        op(res).json(err).internal_error().send();
    })    
});


module.exports = router;