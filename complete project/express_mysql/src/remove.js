const router = require('express').Router();
const url = require("url");
const async = require("async");
const query = require("./base/db_handle");
const op = require('./base/HttpOutput');

router.post('/', async (req,res)=>{
    var {_id} = req.body;
    sql_str = `delete from linkmen where _id="${_id}"`;
    if(req.boo){
        await query(sql_str).then((result)=>{
            op(res).json({boo:req.boo}).send();
        }).catch((err)=>{
            op(res).json(err).internal_error().send();
        })
    }else{
        op(res).json({boo:req.boo}).send();
    }
});


module.exports = router;