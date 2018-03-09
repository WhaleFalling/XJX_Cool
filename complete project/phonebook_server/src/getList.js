const _router = require("./router");
const get_mime = require('./mime');
const query = require("querystring");
const url = require("url");
const ObjectId = require('mongodb').ObjectId;
const uuid=require("uuid");
const async=require("async");
const fetch=require('isomorphic-fetch');
let router = new _router();

/*
    DB:c4_phonebook
    collection:linkman,users
*/

// 加载mongo的组件
const mongodb = require("mongodb");
const db_client = mongodb.MongoClient;
const db_connstr = 'mongodb://127.0.0.1:27017/c4_phonebook';

// 插入测试数据
router.get("/insertTestData", (req, res) => {
    //测试数据
    let linkman = {
        name: "广银儿",
        phone: "045188558868",
        mobile: "13111111111",
        wechatURL: "https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk",
        remark: "学生"
    };

    //插入操作的定义
    const doInsert = (db, callback) => {
        let collection = db.collection("linkman");
        collection.insert(linkman, (err, result) => {
            if (err) {
                console.log('插入失败', err);
                callback(err, result);
            } else {
                callback(undefined, result);
            }
        });
    }
    //连接数据库
    db_client.connect(db_connstr, (err, db) => {
        if (err) {
            console.log("连接数据库失败", err)
        } else {
            doInsert(db, (err, result) => {
                if (err) {
                    //失败
                    res.end("ERR")
                } else {
                    res.end("OK");

                }
                //记住，用完一定要关连接
                db.close();
            });
        }
    })


});

//以下代码包含两种形式 
//使用/**/注释掉的是原本的地狱回调方式
//未注释的是使用async组件的waterfall方法的串行依赖方式

/*router.get("/list", (req, res) => {

    var querystring = url.parse(req.url).query;
    var param = query.parse(querystring);
    //连接数据库
    db_client.connect(db_connstr, (err, db) => {
        if (err) {
            console.log("连接数据库失败", err)
        } else {
            let collection = db.collection("linkman");
            let $where = param.keyword ? {$or:[{name: new RegExp(param.keyword)},
                                                {remark:new RegExp(param.keyword)}]} : {};
            
            collection.find($where).sort({ "_id": -1 }).toArray((err, result) => {
                if (!err) {
                    
                    if(param.token){
                        let collection = db.collection("users");
                        collection.find({token:param.token}).toArray((err,resu)=>{
                            if(resu.length==1){
                                res.writeHead(200, { 'Content-Type': get_mime('json') });
                                res.end(JSON.stringify({list:result,boo:true}));
                            }else{
                                res.writeHead(200, { 'Content-Type': get_mime('json') });
                                res.end(JSON.stringify({list:result,boo:false}));
                            }
                            db.close();
                        })
                    }else{
                        res.writeHead(200, { 'Content-Type': get_mime('json') });
                        res.end(JSON.stringify({list:result,boo:false}));
                    }
                }
                db.close();
            });
        }
    })
    // res.end(JSON.stringify(data));
})*/
router.get("/list", (req, res) => {

    var querystring = url.parse(req.url).query;
    var param = query.parse(querystring);
    //连接数据库
    async.waterfall([
        (callback)=>{
            db_client.connect(db_connstr,(err,db)=>{
                if(err){
                    callback(err,db);
                }else{
                    callback(null,db);
                }
            })
        },
        (db,callback)=>{
            if(param.token){
                let collection = db.collection("users");
                collection.find({token:param.token}).toArray((err,result)=>{
                    if(result.length == 1){
                        let boo = true;
                        callback(null,{db:db,boo:boo});
                    }else{
                        let boo = false;
                        callback(null,{db:db,boo:boo});
                    }
                })
            }else{
                let boo = false;
                callback(null,{db:db,boo:boo});
            }
        },
        (prev,callback)=>{
            if(prev.boo){
                let collection = prev.db.collection("linkman");
                let $where = param.keyword ? {$or:[{name: new RegExp(param.keyword)},
                                                    {remark:new RegExp(param.keyword)}]} : {};
                collection.find($where).sort({"_id":-1}).toArray((err,result)=>{
                    if(!err){
                            callback(null,{db:prev.db,list:result,boo:prev.boo});
                    }else{
                        callback(err,{db:prev.db});
                    }
                })
            }else{
                let collection = prev.db.collection("linkman");
                let $where = param.keyword ? {$or:[{name: new RegExp(param.keyword)},
                                                    {remark:new RegExp(param.keyword)}]} : {};
                collection.find($where).sort({"_id":-1}).toArray((err,result)=>{
                    if(!err){
                            callback(null,{db:prev.db,list:result,boo:prev.boo});
                    }else{
                        callback(err,{db:prev.db});
                    }
                })
            }
        }
    ],(err,result)=>{
        result.db.close();
        if(err){
            console.log(err.message);
        }else{
            if(result.boo){
                res.end(JSON.stringify({list:result.list,boo:true}));
            }else{
                res.end(JSON.stringify({list:result.list,boo:false}));
            }
        }
    })
})

/*router.post("/create", (req, res) => {
    var post = '';

    req.on('data', function (chunk) {
        post += chunk.toString();
    });

    req.on('end', function () {
        post = query.parse(post);
        const doInsert = (db, callback) => {
            let collection = db.collection("linkman");
            collection.insert(post, (err, result) => {
                if (err) {
                    console.log('插入失败', err);
                    callback(err, result);
                } else {
                    callback(undefined, result);
                }
                db.close();
            });
        }

        db_client.connect(db_connstr, (err, db) => {
            if (err) {
                console.log("连接数据库失败", err)
            } else {
                if(post.token){
                    let collection = db.collection("users");
                    collection.find({token:post.token}).toArray((err,resu)=>{
                        if(resu.length==1){
                            doInsert(db, (err, result) => {
                                if (err) {
                                    //失败
                                    res.end("ERR")
                                } else {
                                    let collection = db.collection("linkman");
                                    collection.find({}).toArray((err, result) => {
                                        if (!err) {
                                            console.log("ok");
                                        }else{
                                            res.end(JSON.stringify({list:result,boo:true}));
                                            db.close();
                                        }
                                        db.close();
                                    });
                                }
                            });
                        }else{
                            res.writeHead(200, { 'Content-Type': get_mime('json') });
                            res.end(JSON.stringify({boo:false}));
                        }
                        db.close();
                    })
                }else{
                    res.writeHead(200, { 'Content-Type': get_mime('json') });
                    res.end(JSON.stringify({boo:false}));
                }
            }
        })
    });
})*/
router.post("/create", (req, res) => {
    var post = '';

    req.on('data', function (chunk) {
        post += chunk.toString();
    });

    req.on('end', function () {
        post = query.parse(post);
        const doInsert = (db, callback) => {
            let collection = db.collection("linkman");
            collection.insert(post, (err, result) => {
                if (err) {
                    console.log('插入失败', err);
                    callback(err, result);
                } else {
                    callback(undefined, result);
                }
                db.close();
            });
        }

        async.waterfall([
            (callback)=>{
                db_client.connect(db_connstr,(err,db)=>{
                    if(err){
                        callback(err,db);
                    }else{
                        callback(null,db);
                    }
                })
            },
            (db,callback)=>{
                if(post.token){
                    let collection = db.collection("users");
                    collection.find({token:post.token}).toArray((err,result)=>{
                        if(result.length == 1){
                            let boo = true;
                            callback(null,{db:db,boo:boo});
                        }else{
                            let boo = false;
                            callback(null,{db:db,boo:boo});
                        }
                    })
                }
            },
            (prev,callback)=>{
                if(prev.boo){
                    doInsert(prev.db,(err,result)=>{
                        if(err){
                            callback(err,{result:result,boo:prev.boo});
                        }else{
                            callback(null,{db:prev.db,boo:prev.boo});
                        }
                    })
                }else{
                    callback(null,{db:prev.db,boo:prev.boo});
                }
            },
            (prev,callback)=>{
                if(prev.boo){
                    let collection = prev.db.collection("linkman");
                    collection.find({}).toArray((err,result)=>{
                        if (!err) {
                            callback(null,{db:prev.db,list:result,boo:prev.boo})
                        }else{
                            callback(err,{db:prev.db,boo:false});
                        }
                    })
                }else{
                    callback(null,{db:prev.db,boo:false})
                }
            }
        ],(err,result)=>{
            result.db.close();
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
    });
})

/*router.post("/remove", (req, res) => {

    const doRemove = (db, id, callback) => {
        let collection = db.collection("linkman");
        collection.remove({ '_id': new ObjectId(id) }, (err, result) => {
            if (err) {
                console.log('删除失败', err);
                callback(err, result);
            } else {
                callback(undefined, result);
            }
        });
    };

    var id = "";
    req.on("data", (chunk) => {
        id += chunk.toString();
    });
    req.on('end', () => {
        token = query.parse(id).token;
        id = query.parse(id)._id;
        db_client.connect(db_connstr, (err, db) => {
            if (err) {
                console.log("连接数据库失败", err)
            } else {
                if(token){
                    let collection = db.collection("users");
                    collection.find({"token":token}).toArray((err,resu)=>{
                        if(resu.length==1){
                            doRemove(db, id, (err, result) => {
                                if (!err) {
                                    let collection = db.collection("linkman");
                                    collection.find({}).toArray((err, result) => {
                                        if (!err) {
                                            console.log("ok");
                                        }else{
                                            res.end(JSON.stringify({boo:true}));
                                            db.close();
                                        }
                                        db.close();
                                    });
                                } else {
                                    res.end("ERR");
                                };
                            });
                        }else{
                            res.writeHead(200, { 'Content-Type': get_mime('json') });
                            res.end(JSON.stringify({boo:false}));
                        }
                        db.close();
                    })
                }else{
                    res.writeHead(200, { 'Content-Type': get_mime('json') });
                    res.end(JSON.stringify({boo:false}));
                }

            }
        })
    })
})*/
router.post("/remove", (req, res) => {

    const doRemove = (db, id, callback) => {
        let collection = db.collection("linkman");
        collection.remove({ '_id': new ObjectId(id) }, (err, result) => {
            if (err) {
                console.log('删除失败', err);
                callback(err, result);
            } else {
                callback(undefined, result);
            }
        });
    };

    var id = "";
    req.on("data", (chunk) => {
        id += chunk.toString();
    });
    req.on('end', () => {
        token = query.parse(id).token;
        id = query.parse(id)._id;

        async.waterfall([
            (callback)=>{
                db_client.connect(db_connstr,(err,db)=>{
                    if(err){
                        callback(err,db);
                    }else{
                        callback(null,db);
                    }
                })
            },
            (db,callback)=>{
                if(token){
                    let collection = db.collection("users");
                    collection.find({token:token}).toArray((err,result)=>{
                        if(result.length == 1){
                            let boo = true;
                            callback(null,{db:db,boo:boo});
                        }else{
                            let boo = false;
                            callback(null,{db:db,boo:boo});
                        }
                    })
                }
            },
            (prev,callback)=>{
                if(prev.boo){
                    doRemove(prev.db,id,(err,result)=>{
                        if(err){
                            callback(err,{db:prev.db,boo:prev.boo});
                        }else{
                            callback(null,{db:prev.db,boo:prev.boo});
                        }
                    })
                }else{
                    callback(null,{db:prev.db,boo:prev.boo});
                }
            },
            (prev,callback)=>{
                if(prev.boo){
                    let collection = prev.db.collection("linkman");
                    collection.find({}).toArray((err,result)=>{
                        if (!err) {
                            callback(null,{db:prev.db,list:result,boo:prev.boo})
                        }else{
                            callback(err,{db:prev.db,boo:false});
                        }
                    })
                }else{
                    callback(null,{db:prev.db,boo:false})
                }
            }
        ],(err,result)=>{
            result.db.close();
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
})

/*router.post("/update", (req, res) => {
    var post = '';

    req.on('data', function (chunk) {
        post += chunk.toString();
    });

    const doUpdate = (db, id, callback) => {
        let collection = db.collection("linkman");
        collection.update({ '_id': new ObjectId(id) }, post, (err, result) => {
            if (err) {
                console.log('更新失败', err);
                callback(err, result);
                db.close();
            } else {
                callback(undefined, result);
                db.close();
            }
        });
    }

    req.on('end', function () {
        post = query.parse(post);
        id = post.id.toString();

        db_client.connect(db_connstr, (err, db) => {
            if (err) {
                console.log("连接数据库失败", err)
            } else {
                if(post.token){
                    let collection = db.collection("users");
                    collection.find({token:post.token}).toArray((err,resu)=>{
                        if(resu.length==1){
                            doUpdate(db, id, (err, result) => {
                                if (err) {
                                    //失败
                                    res.end("ERR")
                                } else {
                                    let collection = db.collection("linkman");
                                    collection.find({}).toArray((err, result) => {
                                        if (!err) {
                                            console.log("ok");
                                        }else{
                                            res.end(JSON.stringify({list:result,boo:true}));
                                            db.close();
                                        }
                                        db.close();
                                    });
                                }
                            });
                        }else{
                            res.writeHead(200, { 'Content-Type': get_mime('json') });
                            res.end(JSON.stringify({boo:false}));
                        }
                        db.close();
                    })
                }else{
                    res.writeHead(200, { 'Content-Type': get_mime('json') });
                    res.end(JSON.stringify({boo:false}));
                }
            }
        })
    });
})*/
router.post("/update", (req, res) => {
    var post = '';

    req.on('data', function (chunk) {
        post += chunk.toString();
    });

    const doUpdate = (db, id, callback) => {
        let collection = db.collection("linkman");
        collection.update({ '_id': new ObjectId(id) }, post, (err, result) => {
            if (err) {
                console.log('更新失败', err);
                callback(err, result);
                db.close();
            } else {
                callback(undefined, result);
                db.close();
            }
        });
    }

    req.on('end', function () {
        post = query.parse(post);
        id = post.id.toString();
        
        async.waterfall([
            (callback)=>{
                db_client.connect(db_connstr,(err,db)=>{
                    if(err){
                        callback(err,db);
                    }else{
                        callback(null,db);
                    }
                })
            },
            (db,callback)=>{
                if(post.token){
                    let collection = db.collection("users");
                    collection.find({token:post.token}).toArray((err,result)=>{
                        if(result.length == 1){
                            let boo = true;
                            callback(null,{db:db,boo:boo});
                        }else{
                            let boo = false;
                            callback(null,{db:db,boo:boo});
                        }
                    })
                }
            },
            (prev,callback)=>{
                if(prev.boo){
                    doUpdate(prev.db,id,(err,result)=>{
                        if(err){
                            callback(err,{result:result,boo:prev.boo});
                        }else{
                            callback(null,{db:prev.db,boo:prev.boo});
                        }
                    })
                }else{
                    callback(null,{db:prev.db,boo:prev.boo});
                }
            },
            (prev,callback)=>{
                if(prev.boo){
                    let collection = prev.db.collection("linkman");
                    collection.find({}).toArray((err,result)=>{
                        if (!err) {
                            callback(null,{db:prev.db,list:result,boo:prev.boo})
                        }else{
                            callback(err,{db:prev.db,boo:false});
                        }
                    })
                }else{
                    callback(null,{db:prev.db,boo:false})
                }
            }
        ],(err,result)=>{
            result.db.close();
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
    });
})

/*router.post("/user/login",(req,res) => {
    var post = '';
    
    req.on('data', function (chunk) {
        post += chunk.toString();
    });

    db_client.connect(db_connstr, (err, db) => {
        post = query.parse(post);
        if (err) {
            console.log("连接数据库失败", err)
        } else {
            let collection = db.collection("users");
            let $where ={userName:post.user_id,passWord:post.password};
            
            collection.find($where).toArray((err, result) => {
                if(result.length!=0 && !err){
                    let token=uuid();
                    collection.update({userName:post.user_id},
                        { $set: { token: token} },
                        (error)=>{
                            if(!error){
                                res.end(JSON.stringify({token:token}));
                            }else{
                                res.end(error);
                            }
                        }
                    );        
                }else{
                    res.end(err || JSON.stringify({token:401}));
                }
                db.close();
            });
        }
    })
})*/
router.post("/user/login",(req,res) => {
    var post = '';
    
    req.on('data', function (chunk) {
        post += chunk.toString();
    });

    req.on('end',function(){
        db_client.connect(db_connstr, (err, db) => {
            post = query.parse(post);
            if (err) {
                console.log("连接数据库失败", err)
            } else {
                let collection = db.collection("users");
                let $where ={userName:post.user_id,passWord:post.password};
                //启用async组件前必须在文件开头引入
                //此处开始使用async组件的waterfall方法（串行依赖方法）
                async.waterfall(
                //waterfall的第一个参数必须是数组，数组里必须是带有callback的函数
                [
                    //串行执行的第一个函数，此函数是用来到数据库匹配前端传来的用户名密码，并设定了
                    //一个boolean值boo，以便调用callback的时候向下一个函数传递信息。
                    (callback)=>{
                        collection.find($where).toArray((err, result) => {                           
                            if(result.length!=0 && !err){
                                var boo = true;
                                callback(null,boo);
                            }else{
                                var boo = false;
                                callback(null,boo);
                            }
                        });              
                    },
                    //串行执行的第二个函数，此函数会接到上一个函数传下来的boo（因为没发生错误），
                    //如果boo是true(在数据库中匹配到用户名密码)，则用uuid生成一个token放入数据库并向下传递，
                    //如果boo是false(未在数据库中匹配到用户名密码)，则给token赋值401并向下传递。
                    (boo,callback)=>{
                        if(boo){
                            let token=uuid();
                            collection.update({userName:post.user_id},
                                { $set: { token: token} },
                                (error)=>{
                                    if(!error){
                                        callback(null,{token:token,boo:boo});
                                    }else{
                                        callback(error,{token:token,boo:boo})
                                    }
                                }
                            );
                        }else{
                            var token = 401;
                            callback(null,{token:token,boo:boo});
                        } 
                    },
                    (prev,callback)=>{
                        async function getData (){
                            var data = await fetch("http://localhost:8082/list",{
                                method:"get",
                                head:{
                                    'Content-Type':'application/json'
                                }
                            })
                            var list = await data.json();
                            if(prev.boo){                            
                                callback(err,{list:list,token:prev.token,boo:prev.boo})
                            }else{
                                callback(err,{token:prev.token,boo:prev.boo});
                            }  
                        }
                        getData();
                    }
                ],
                //waterfall方法的第二个参数：一个接收上述串行函数执行中出现的错误(err)和传下来的参数(token)的回调函数;
                //如果出现错误，那么在控制台输出错误的信息，如果没出错误，就将token转成字符串返给客户端。
                (err,prev)=>{
                    db.close();
                    if(!err){
                        res.end(JSON.stringify({token:prev.token,list:prev.list}));
                    }else{
                        console.log(err.message);
                    }
                })
            }
        })
    })   
})

module.exports = router;