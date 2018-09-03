/**
 * ajax封装
 * @Author   我贼帅
 * @DateTime 2018-08-01
 */
import 'whatwg-fetch'

import 'babel-polyfill'
// import fetch from 'isomorphic-fetch'

import {prefix} from '../config'

import {Storage, logOut, isArray} from './util'





/**
 *对fetch插件的配置
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @param    {[type]}   method        [请求方法]
 * @param    {[type]}   url           [请求地址]
 * @param    {[type]}   params        [请求参数]
 * @param    {[type]}   target        [请求host地址]
 * @return   {[type]}                 [description]
 */
 const fetchJSON = (method,url,params,target)=>{
    let headers = new Headers();
    let body = method == 'GET' ? null : JSON.stringify(params);
    headers.set('Content-Type','application/x-www-form-urlencoded');
    const data = {
        method: method,
        headers:headers,
        cache: 'default',
        credentials: 'same-origin',
        body: body
    };
    let options = '';
    if(method == 'GET'){
       for(let key in params){
            let str = options == '' ? `?${key}=${params[key]}` : `&${key}=${params[key]}`;
            options += str;
       }
       url += options;
    }

    let newUrl;
    newUrl = target? `${target}${url}` : `${prefix}${url}`;
    return fetch(newUrl, data);
}

/**
 * 对fetch的get请求封装
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @param    {[type]}   url    [请求地址]
 * @param    {[type]}   target [请求host地址]
 * @param    {[type]}   query  [请求参数]
 * @return   {[type]}          [description]
 */
 const fetchJSONByGet = (url, target) => query => 
    fetchJSON('GET',url,query,target);


/**
 * 对fetch的POST请求封装
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @param    {[type]}   url    [请求地址]
 * @param    {[type]}   target [请求host地址]
 * @param    {[type]}   query  [请求参数]
 * @return   {[type]}          [description]
 */
 const fetchJSONByPost = (url, target) => query => 
    fetchJSON('POST',url,query,target);


/**
 * 请求错误处理
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @param    {[type]}   error [description]
 * @return   {[type]}         [description]
 */
const catchError =(error)=>{
    const {response} = error;
    if(!response){
        console.log(error);
        return;
    }
    if(response.status === 401){
        alert('请重新登录！');
        window.location.reload();
    }else if(response.status === 403){
        alert('你缺少相关权限，部分功能无法使用');
    }
}

/**
 * 检查请求状态
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @param    {[type]}   response [description]
 * @return   {[type]}            [description]
 */
const checkStatus = (response)=>{
    if(response.status >= 200 && response.status < 300){
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * 创建一个ajax请求(多重箭头函数，复杂晦涩)
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @param    {[type]}   api         [description]
 * @param    {[type]}   startAction [description]
 * @param    {Function} endAction)  [description]
 * @return   {[type]}               [description]
 */
 const createAjaxAction = (api, startAction, endAction) => (data,cb,reject) => (dispatch) => {
    let respon;
    let newData = data || {};
    startAction && dispatch(startAction()); //?
    const token = Storage.getItem('token');
    if(token){
        newData.token = token;
    }
    newData = isArray(newData) ? newData: [newData]; //why?
    console.log('newData:'+JSON.stringify(newData));
    api(...newData)
        .then(checkStatus)
        .then(response => response.json())
        .then((res)=>{
            respon = res;
            endAction && dispatch(endAction()); //?
        })
        .then(()=>{
            alert(respon.msg)
            switch(respon.code){
                case 1:
                    //成功
                    cb && cb(respon);
                    break;
                case 0:
                    //失败
                    if(typeof reject === 'function'){
                        reject(respon);
                    }else{
                        alert(respon.msg)
                    }
                    break;
                case -1:
                    //重新登录
                    logOut();
                    break;

            }
        })
        .catch(catchError)
}

export {
    createAjaxAction,
    fetchJSONByPost,
    fetchJSONByGet,
    fetchJSON
}






