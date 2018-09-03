
let LocalStorage = {
    setItem: (key,value,time='',now = new Date().getTime())=>{
       console.log(key);
        if(!key){
            throw Error('参数错误','key值不能为空')
        }
        let params = {key:key,value:value,time:time,now: now};
        let json = JSON.stringify(params);
        window.localStorage.setItem(key,json);

    },

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
    }
};

let checkLogin = (_this)=>{
    let userName = LocalStorage.getItem('userName');
    if(!userName){
         _this.$router.push({path:'home'});
    }
}

/**
 * 鼠标滚动缩放图片
 * [description]
 * @param  {[type]} obj [description]
 * @param  {[type]} img [description]
 * @param  {Number} min [description]
 * @param  {Number} max [description]
 * @return {[type]}     [description]
 */
let scrollZoom = (obj,img,min=1,max=3)=>{
    let scale = 1;
    let scrollZoomFn = (e)=>{
        let en = e || window.event;
        let dir = true;
        
        if(en.wheelDelta){
            //ie,chrome
            dir = en.wheelDelta>0?true: false;
        }else{
            //firefox
            dir = en.detail<0?true: false;
        }

        if(dir){
            //上->放大
            if(scale>max) return;
            scale+=0.1;

        }else{
            //下->缩小
            if(scale<min) return;
            scale-=0.1;
        }
        imgObj.style.transform = 'scale('+scale+')';

        if(en.preventDefault){
            en.preventDefault();
        }
        return false;
    }
    let scrollObj = document.getElementsByClassName(obj)[0];
    let imgObj = document.getElementsByClassName(img)[0];
    scrollObj.removeEventListener("DOMMouseScroll", scrollZoomFn, false);
    scrollObj.onmousewheel = null;

    if(document.addEventListener){
        document.addEventListener("DOMMouseScroll", scrollZoomFn, false);
    }
    scrollObj.onmousewheel = scrollZoomFn;
    console.log('mousewheel');

    


}



export {LocalStorage, checkLogin, scrollZoom};