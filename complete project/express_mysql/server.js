const express=require("express");
const http=require("http");
const app=express(); 
var server=http.createServer(app);

app.use(express.static(`${__dirname}/public/`))

const list=require("./src/list");
const checktoken=require("./src/checktoken");
const create=require("./src/create");
const remove=require("./src/remove");
const update=require("./src/update");
const userlogin=require("./src/userlogin");


app.use("*",checktoken);
app.use("/user",userlogin)
app.use("/list",list);
app.use("/create",create);
app.use("/remove",remove);
app.use("/update",update)


console.log("ok");
server.listen(3001,(err)=>{
    if(err){
        throw err;
    }else{
        console.log("start on 3000");
    }
})