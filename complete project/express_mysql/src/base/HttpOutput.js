class Output{
    constructor(response,content){
        this.response = response;
        this.mime = "application/json";
        this.status = 200;
        this.content = content;
        var now_time=Date.now();
    }
    
    send(){
        this.response.end(this.content);
    }

    //状态
    ok(){
        this.status=200;
        return this;
    }
    not_found(){
        this.status=404;
        return this;
    }
    not_access(){
        this.status=401;
        return this;
    }
    internal_error(){
        this.status=500;
        return this;
    }

    //类型
    json(data){
        this.content=JSON.stringify(data);
        return this;
    }

    text(content){
        this.content=connect;
        return this;
    }
}

module.exports=function(response,content){
    return new Output(response,content)
}