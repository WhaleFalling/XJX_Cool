const express = require('express');
const router = express.Router();

router.get("/",(req,res,next)=>{
    res.writeHead(200, { 'content-Type': "application/json" });
    let data=[
        "1.jpg","2.jpg","3.jpg","4.jpg","5.jpg"
    ]
    res.end(JSON.stringify(data));
});

module.exports=router;