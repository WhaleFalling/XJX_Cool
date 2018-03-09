const router = require('express').Router();
const url = require("url");
const async = require("async");
const query = require("./base/db_handle");
const op = require('./base/HttpOutput');

router.get('/', async (req,res)=>{
    const keyword = req.query.keyword?`%${req.query.keyword}%`:'%';
    sql_str = `select * from test.linkmen where name like "${keyword.toString()}" or remark like "${keyword}" order by _id DESC`;
    await query(sql_str).then((result)=>{
        op(res).json({list:result,boo:req.boo}).send();
    }).catch((err)=>{
        op(res).json(err).internal_error().send();
    })    
});


module.exports = router;