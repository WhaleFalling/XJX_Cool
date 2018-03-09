//ajax 组件

//引入fetch
import 'whatwg-fetch';
//引入接口列表
import ports from '../options/ports';
import store from '../redux/store';
import actionTypes from '../redux/actionTypes';


const { dispatch } = store;
//把对象参数格式添加到URL结尾

function UrlQuery(url, params) {
    let paramsArray = [];
    //拼接参数
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
    if (url.search(/\?/) === -1) {
        url += '?' + paramsArray.join('&');
    } else {
        url += '&' + paramsArray.join('&');
    }
    return url;
};
//@ts-check
function set_noLogin(callback) {
    dispatch(actionTypes.create(
        actionTypes.SET_LOGIN_STATE,
        {
            isLogion: false,
            callback
        }
    ));
}

//response的处理方法
async function check_response(response, { resolve, reject, callback }) {
    //第一次then，要判断 状态
    if (response.status === 200) {
        //成功状态
        if (response.headers.get("Content-Type").indexOf('application/json') >= 0) {
            resolve(response);
        } else {
            reject({ message: `返回结果的Content-Type类型不对` });
        }
    } else {
        //失败状态 根据不同的状态进行处理
        switch (response.status) {
            //未找到页面
            case 404:
                reject({ message: '页面未找到或页面不存在' });

            //未登录
            case 401:
                set_noLogin(callback);
                reject({ message: '未登录' })
            //权限不足
            case 403:
                reject({ message: '你的权限不足' })

            default:
                if (response.headers.get("Content-Type").indexOf('application/json') >= 0) {
                    var error = await response.json();
                    reject(error);
                } else {
                    var text = await response.text();
                    if (text) {
                        reject({ message: text });
                    } else {
                        reject({ message: '服务器未知错误' })
                    }
                }
        }
    }
}

var fetchData = {
    ports,//接口地址
    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            //FETCH方法有一个问题，除了链接失败以外，所有的返回（包括404、500等……都会resolve，而不会reject
            fetch(UrlQuery(url, params), {
                credentials: 'include' //每次访问都携带cookie
            }).then((response) => {
                check_response(response, {
                    resolve,
                    reject,
                    callback: () => this.get(url, params).then(resolve).catch(reject)
                });
            }).catch((error) => {
                reject(error);
            })
        });
    },
    getJSON(url, params = {}) {
        return new Promise((resolve, reject) => {
            this.get(url, params).then((response) => {
                return response.json();
            }).then((json) => {
                resolve(json);
            }).catch((error) => {
                reject(error);
            })
        });
    },
    post(url, params = {}) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                credentials: 'include', //每次访问都携带cookie
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(params)
            }).then((response) =>{
                check_response(response, {
                    resolve,
                    reject,
                    callback: () => this.post(url, params).then(resolve).catch(reject)
                });
            }).catch((error) => {
                reject(error);
            })
        });
    },

    postJSON(url, params = {}) {
        return new Promise((resolve, reject) => {
            this.post(url, params).then((response)=>{
                return response.json();
            }).then((json)=>{
                resolve(json);
            }).catch((error)=>{
                reject(error);
            })
        });
    }
}

export default fetchData;