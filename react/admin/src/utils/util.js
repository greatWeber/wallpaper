/**
 * 工具类
 * @authors 我贼帅
 * @date    2018-08-02 09:35:42
 */
import {browserHistory} from 'react-router'


/**
 * 判断是否为数组
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @param    {[type]}   arr [description]
 * @return   {[type]}       [description]
 */
export const isArray = (arr) =>{
    return Object.prototype.toString.call(arr) === '[object Array]'

}

/**
 * [Storage 自定义有时间限制的localStorage]
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @type {Object}
 */
export const Storage = {
    getItem: (key)=>{
        if(!key){
            throw Error('参数错误','key值不能为空')
        }

        let data = window.localStorage.getItem(key);
        console.log(data);
        if(!data){
            return null;
        }
        let params = JSON.parse(data);
        
        if(params.time){
            let range = params.time * 3600* 1000;
            let time = new Date().getTime();
            if(parseInt(params.now) + range < time){
                window.localStorage.setItem(key,'');
                return null;
            }else{
                return params.value;
            }
        }
    },
    
    /**
     * 设置缓存
     * @Author   我贼帅
     * @DateTime 2018-08-03
     * @param    {[type]}   key   [description]
     * @param    {[type]}   value [description]
     * @param    {String}   time  [有效期(house)]
     * @param    {Date}     now   [description]
     * @return   {[type]}         [description]
     */
    setItem: (key,value,time='',now = new Date().getTime())=>{
       console.log(key);
        if(!key){
            throw Error('参数错误','key值不能为空')
        }
        let params = {key:key,value:value,time:time,now: now};
        let json = JSON.stringify(params);
        window.localStorage.setItem(key,json);

    },
    clear: ()=>{
        window.localStorage.clear();
    }
}

/**
 * 退出登录
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @return   {[type]}   [description]
 */
export const logOut = () => {
    console.log('logOut');
    Storage.clear();
    browserHistory.push('/login');
}

/**
 * 去掉对象数组中的多余空格
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @param    {[type]}   val [description]
 * @return   {[type]}       [description]
 */
export const Trim = (val) => {
    let values = val;
    Object.keys(values).map(key => values[key] = (values[key] && values[key].trim()));
    return values;
}

/**
 * 自定义forEach函数(原生的不能退出)
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @param    {[type]}   arr  [description]
 * @param    {[type]}   func [description]
 * @return   {[type]}        [description]
 */
export const each = (arr,func) => {
    const len = arr.length;
    for(let i=0;i<len;i++){
        let ret = func.call(this,arr[i],i);
        if(typeof ret !== 'undefined' && (ret == null || ret == false)){
            break;
        }
    }
}

/**
 * 表单数据检查
 * @Author   我贼帅
 * @DateTime 2018-08-02
 * @param    {[type]}   data [description]
 * @return   {[type]}        [description]
 */
export const checkData = (data) => {
    let bool = true;
    each(data, (item, i)=>{
        if(!item.val){
            alert(item.key+'不能为空');
            bool = false;
            return false;
        }
    })
    return bool;
}






