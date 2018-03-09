import immutable from 'immutable';

export default immutable.fromJS({
    user_info:null,//用户信息
    //视图相关
    view:{
        viewLoading:false,//全屏加载
        isMount:true,//第一次载入界面
        collapsed:false//左边栏折叠
    },
    isLogin:false,//验证身份
    loginCallback:[]//login后回调队列
});