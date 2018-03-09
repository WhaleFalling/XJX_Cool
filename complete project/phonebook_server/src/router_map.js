/*
    请求的类型：基本的分为post和get
    根据map对像查找对应的处理程序
*/
const get_static = require('./get_static');
const get_mime=require('./mime');
module.exports=[{
    method:'get',
    path:'/',
    title:'首页',
    handler:(req,res)=>{
        
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
    }
},{
    method:'get',
    path:'/list',
    title:'联系人列表',
    handler:(req,res)=>{
        res.writeHead(200, {'Content-Type': get_mime('json')});
        let data=[{
            _id: "aaaaaaafdsfadsf",
            name: "广银儿",
            phone: "045188558868",
            mobile: "13111111111",
            wechatURL:"https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk",
            remark: "学生"
        
        }, {
            _id: "aaaaaaafdsfadsf",
            name: "广银儿",
            phone: "045188558868",
            mobile: "13111111111",
            wechatURL:"https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk",
            remark: "学生"
        
        }, {
            _id: "aaaaaaafdsfadsf",
            name: "广银儿",
            phone: "045188558868",
            mobile: "13111111111",
            wechatURL:"https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk",
            remark: "学生"
        
        }, {
            _id: "aaaaaaafdsfadsf",
            name: "广银儿",
            phone: "045188558868",
            mobile: "13111111111",
            wechatURL:"https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk",
            remark: "学生"
        
        }, {
            _id: "aaaaaaafdsfadsf",
            name: "广银儿",
            phone: "045188558868",
            mobile: "13111111111",
            wechatURL:"https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk",
            remark: "学生"
        
        }, {
            _id: "aaaaaaafdsfadsf",
            name: "广银儿",
            phone: "045188558868",
            mobile: "13111111111",
            wechatURL:"https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk",
            remark: "学生"
        
        }, {
            _id: "aaaaaaafdsfadsf",
            name: "广银儿",
            phone: "045188558868",
            mobile: "13111111111",
            wechatURL:"https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk",
            remark: "学生"
        
        }, {
            _id: "aaaaaaafdsfadsf",
            name: "广银儿",
            phone: "045188558868",
            mobile: "13111111111",
            wechatURL:"https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk",
            remark: "学生"
        
        }, {
            _id: "aaaaaaafdsfadsf",
            name: "广银儿",
            phone: "045188558868",
            mobile: "13111111111",
            wechatURL:"https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk",
            remark: "学生"
        
        }, {
            _id: "aaaaaaafdsfadsf",
            name: "银儿",
            phone: "045188558868",
            mobile: "13111111111",
            wechatURL:"https://u.wechat.com/EA6-1zRnGREBCQUQobmfyDk",
            remark: "学生"
        
        }, {
            _id: "aaaaaaafdsfadsf",
            name: "广银儿",
            phone: "045188558868",
            mobile: "13111111111",
            remark: "学生"
        
        }];

        res.end(JSON.stringify(data));
    }
}];