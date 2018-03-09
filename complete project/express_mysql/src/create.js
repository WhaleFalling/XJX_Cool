const router = require('express').Router();
const url = require("url");
const async = require("async");
const query = require("./base/db_handle");
const op = require('./base/HttpOutput');

router.post('/', async (req, res) => {
    var {name,phone,mobile,wechatUrl,remark} = req.body;
    sql_str = `INSERT INTO linkmen (name,phone,mobile,wechatUrl,remark) VALUES ("${name}", "${phone}", "${mobile}", "${wechatUrl}", "${remark}")`;
    arr = [name,phone,mobile,wechatUrl,remark];
    if(req.boo){
        await query(sql_str).then((result) => {
            op(res).json({ list: result, boo: req.boo }).send();
        }).catch((err) => {
            op(res).json(err).internal_error().send();
        })
    }else{
        op(res).json({boo: req.boo }).send();
    }
});


module.exports = router;