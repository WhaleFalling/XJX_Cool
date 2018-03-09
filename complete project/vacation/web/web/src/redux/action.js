import types from './actionTypes';
import {fromJS} from 'immutable';

let action={};
export default action;
//左边栏折叠
action[types.COLLAPSED_VIEW_SIDER]=(state,date)=>{
    return state.setIn(["view","collapsed"],date)
}
//设置登录状态
action[types.SET_LOGIN_STATE]=(state,data)=>{
    const {isLogin,callback} = data;
    if(isLogin){
        //登陆成功
        let loginCallback=state.get("loginCallback").toJSON();
        while(loginCallback.length){
            loginCallback.pop();
        }
        return state.set("isLogin",true).set("loginCallback",fromJS([loginCallback]))
    }else{
        //退出登录
        return state.update("loginCallback",(v)=>{
            if(callback){
                return v.push(callback);
            }else{
                return v;
            }
        }).set("isLogin",false)
    }
}

//试图初始化
action[types.SET_VIEW_IS_MOUNT]=(state,data)=>{
    return state.setIn(["view",'isMount'],data);
}