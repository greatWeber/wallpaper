/**
 * 全局配置文件
 * @Author   我贼帅
 * @DateTime 2018-07-31
 */

export default (()=>{
    window.gconfig = {};
    +((global)=>{
        global.linkUrl = 'http://127.0.0.1:8088/admin';

    })(window.gconfig);
})();

export const prefix = global.gconfig.linkUrl;
export const suffix = '.json';