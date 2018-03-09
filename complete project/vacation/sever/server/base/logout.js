const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");

const md5=require("md5");
const guid=require("guid");

module.exports = router;

router.post("/",(req,res)=>{
    const {token}=req.cookies;
    const $sql = `UPDATE admin_user SET token='' WHERE token=?`;

    dq($sql,[token]).then((result)=>{
        res.cookie("token","0",{httpOnly:true});
        ho(res).send({message:'用户身份已失效'});
    }).catch((e)=>{
        ho(res).internal_error(e).send();
    })
})