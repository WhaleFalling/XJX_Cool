const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");
const moment=require("moment");
const md5=require("md5");
const guid=require("guid");

module.exports = router;

router.post("/",(req,res)=>{
    const {login_id,password,remember} = req.body;

    const $sql_find=`SELECT user_id FROM admin_user WHERE login_id=? AND password=? AND locked=0`;
    const $sql_set_token = `UPDATE admin_user SET token=?,last_login=? WHERE user_id=?`;

    async.waterfall([
        (callback)=>{
            dq($sql_find,[login_id,md5(password)]).then((result)=>{
                if(result.length){
                    const userInfo = result[0];
                    callback(null,userInfo);
                }else{
                    callback({message:"用户名不存在或密码错误"})
                }
            }).catch((error)=>{
                callback(error);
            })
        },
        (userInfo,callback)=>{
            const token = guid.raw();
            const nowTime = moment(Date.now()).format("YYYYMMDDHHmmss");
            const {login_id,user_name,icon,last_login,last_ip,is_administrator,email}=userInfo;

            dq($sql_set_token,[token,nowTime,userInfo.user_id]).then((result)=>{
                callback(null,{login_id,user_name,icon,last_login,last_ip,is_administrator,email,token});
            }).catch((error)=>{
                callback(error);
            });
        }],(error,result)=>{
            if(error){
                ho(res).internal_error(error).send();
            }else{
                let expires = 0;
                if(remember){
                    expires = new Date(Date.now()+(60*60*1000*24*30));
                }
                res.cookie('token',result.token,{expires,httpOnly:true});
                delete result.token;
                ho(res).send(result);
            }
        }
    )
});

router.get("/",(req,res)=>{
    const {token}=req.cookies;
    const $sql = `SELECT * FROM admin_user WHERE token=?`;
    dq($sql,[token]).then((result)=>{
        if(result.length){
            const {login_id,user_name,icon,last_login,last_ip,is_administrator,sex,email} = result[0];
            ho(res).send({login_id,user_name,icon,last_login,last_ip,is_administrator,email})
        }else{
            ho(res).unauthorized({message:'您还没有登录'}).send();
        }
    }).catch((error)=>{
        ho(res).internal_error(error).send();
    })
})