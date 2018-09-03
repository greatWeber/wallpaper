import axios from 'axios'



axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://127.0.0.1:8088'

axios.interceptors.request.use(
    config=> {
        // config.data = config.data
        config.headers = {
            'Content-Type':'application/json'
        }
        // console.log(config)
        return config;
    },
    err => {
        return Promise.reject(err);
    }
)

/**Get 方法
 * @param {地址}
 * @param {参数}
 * @return promise
 */
export function Get(_this,url, params={}){
   load_show(_this);
    return new Promise((resolve,reject)=>{
        axios.get(url, {
            params: params
        }).then(response=>{
            load_hide(_this);
            resolve(response.data);
        }).catch(err => {
            load_hide(_this);
            reject(err)
        })
    })
}

/**Post 方法
 * @param {地址}
 * @param {参数}
 * @return promise
 */
export function Post(_this,url, params={}){
    load_show(_this);
    return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url: url,
          data: params
        }).then(response=>{
            load_hide(_this);
            resolve(response.data);
        }).catch(err => {
            load_hide(_this);
            reject(err)
        });
    })
}

/**
 * 显示加载
 */
function load_show(_this){
    try {
        _this.$refs.load.show();
    } catch(e) {
        // statements
        console.log(e);
    }
}

/**
 * 隐藏加载
 */
function load_hide(_this){
    try {
        setTimeout(()=>{
            _this.$refs.load.hide();
        },100)
        
    } catch(e) {
        // statements
        console.log(e);
    }
}