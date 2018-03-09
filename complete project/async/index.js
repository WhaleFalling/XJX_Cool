var async=require("async");

async.waterfall([
    (callback)=>{
        var ok = "ok";
        if(!!ok){
            callback(null,ok)
        }
    },
    (ok,callback)=>{
        var token = 6514651451546531564163;
        //token insert in users
        callback(null,token);
    }
],(err,result)=>{
    if(!err)
    console.log(JSON.stringify(result));
})