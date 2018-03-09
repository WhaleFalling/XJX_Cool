const http = require('http');
const url = require('url');
const query = require('querystring');
const fs = require('fs');

const get_static = require('./src/get_static');
const get_mime = require('./src/mime');

const _router=require("./src/router");


//加载子处理过程
const get_list=require("./src/getList");
const user=require("./src/user")
//定义路由
let router=new _router();

router.get("/",(req,res)=>{
    //输出静态资源
    get_static(`/index.html`, (error, data) => {
        if (!error) {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end(data, "binary");

        } else {
            res.writeHead(404, { 'Content-Type': 'text/html;charset=UTF-8' });
            res.end("404没有找到指定的资源");
        }
    });
})

router.use(get_list);
router.use(user);
const server = http.createServer((req, res) => {
    let u = url.parse(req.url);
    const method = req.method.toLowerCase();
    let pathname = u.pathname;
    let query_obj = query.parse(u.query);
    
    // 第一步：查找路由表
    //在router里查找对应的处理程序
    let handler=router.find(req);
    if(handler){
        handler.callback(req,res);
    }else{
        //第二步：路由表没处理的请求，我们在第二步里查找是否有静态资源
        //提取mime信息
        let name_arr = pathname.split('').reverse();
        let ex_name = name_arr.slice(0, name_arr.indexOf('.')).reverse().join('');
        // 判断mime，如果没有找到对应的mime信息，就提示错误
        try {
            var mime_name = get_mime(ex_name);
        } catch (e) {
            res.writeHead(404, { 'Content-Type': 'text/html;charset=UTF-8' });
            res.end('没有找到指定的资源');  
            return;          
        }
        //输出静态资源
        get_static(pathname, (error, data) => {
            if (!error) {
                res.writeHead(200, { 'Content-Type': `${mime_name}` });
                res.end(data, "binary");

            } else {
                res.writeHead(404, { 'Content-Type': 'text/html;charset=UTF-8' });
                res.end("404没有找到指定的资源");
            }
        });
    }

    console.log(`接到请求`, req);
});
console.log(`监听启动：8082`);
server.listen(8082);