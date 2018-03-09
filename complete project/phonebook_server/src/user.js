const _router = require("./router");
const get_mime=require('./mime');
let router = new _router();

router.post("/user/login",(req,res)=>{
    res.writeHead(200, { 'Content-Type': get_mime('json') });
    res.end(JSON.stringify({token:'token'}));
});

module.exports=router;