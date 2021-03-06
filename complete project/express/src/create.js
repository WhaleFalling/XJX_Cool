const router=require('express').Router();
const url=require("url");
const async=require("async");
const bodyParser=require("body-parser"); 
const db=require("mongoose");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.post("/", (req, res, next) => {

    var post = req.body;
    const doInsert = (callback) => {
        let m_linkman = db.model("linkman");
        let data={
            name:post.name,
            phone:post.phone,
            mobile:post.mobile,
            weichatUrl:post.weichatUrl,
            remark:post.remark
        }
        m_linkman.create(data, (err, result) => {
            if (err) {
                console.log('插入失败', err);
                callback(err, result);
            } else {
                callback(null, result);
            }
        });
    }

    async.waterfall([
        (callback)=>{
            if(post.token){
                let m_manager = db.model("manager");
                m_manager.find({token:post.token},(err,result)=>{
                    if(result.length == 1){
                        let boo = true;
                        callback(null,{boo:boo});
                    }else{
                        let boo = false;
                        callback(null,{boo:boo});
                    }
                })
            }
        },
        (prev,callback)=>{
            if(prev.boo){
                doInsert((err,result)=>{
                    if(err){
                        callback(err,{result:result,boo:prev.boo});
                    }else{
                        callback(null,{boo:prev.boo});
                    }
                })
            }else{
                callback(null,{boo:prev.boo});
            }
        },
        (prev,callback)=>{
            if(prev.boo){
                let m_linkman = db.model("linkman");
                m_linkman.find({},(err,result)=>{
                    if (!err) {
                        callback(null,{list:result,boo:prev.boo})
                    }else{
                        callback(err,{boo:false});
                    }
                })
            }else{
                callback(null,{boo:false})
            }
        }
    ],(err,result)=>{
        if(err){
            console.log(err.message);
        }else{
            if(result.boo){
                res.end(JSON.stringify({list:result.list,boo:true}));
            }else{
                res.end(JSON.stringify({boo:false}));
            }
        }
    })
})

module.exports=router;