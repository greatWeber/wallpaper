/**
 * 路由页面
 * @Author   我贼帅
 * @DateTime 2018-07-30
 */
import React, { Component } from 'react';
import {Router , Route, IndexRoute, browserHistory } from 'react-router';

import {util} from './utils'

import history from './history';



import Home from './pages/Home';

import About from './pages/About';

/**
 * 登录
 * @Author   我贼帅
 * @DateTime 2018-07-31
 * [require.ensure]
 * [传送门](http://www.css88.com/doc/webpack2/guides/code-splitting-require/)
 * 代码分割，按需加载
 */
const Login = (location, cb) =>{
    require.ensure([],(require)=>{
        cb(null,require('./pages/Login').default)
    },'login');
}

//注册
const Register = (location, cb) =>{
    require.ensure([],(require)=>{
        cb(null,require('./pages/Register').default)
    },'register');
}


//添加图片
const List = (location, cb) =>{
    require.ensure([],(require)=>{
        cb(null,require('./pages/List').default)
    },'List');
}

//添加图片
const addPic = (location, cb) =>{
    require.ensure([],(require)=>{
        cb(null,require('./pages/addPic').default)
    },'addPic');
}

//图片分类
const catePic = (location, cb) =>{
    require.ensure([],(require)=>{
        cb(null,require('./pages/catePic').default)
    },'catePic');
}

//添加图片分类
const addCate = (location, cb) =>{
    require.ensure([],(require)=>{
        cb(null,require('./pages/addCate').default)
    },'addCate');
}

//修改图片分类
const editCate = (location, cb) =>{
    require.ensure([],(require)=>{
        cb(null,require('./pages/editCate').default)
    },'editCate');
}

//标签列表
const labelList = (location, cb) =>{
    require.ensure([],(require)=>{
        cb(null,require('./pages/labelList').default)
    },'labelList');
}

//添加标签
const addLabel = (location, cb) =>{
    require.ensure([],(require)=>{
        cb(null,require('./pages/addLabel').default)
    },'addLabel');
}

//修改标签
const editLabel = (location, cb) =>{
    require.ensure([],(require)=>{
        cb(null,require('./pages/editLabel').default)
    },'editLabel');
}


/**
 * 进入路由前的判断
 * @Author   我贼帅
 * @DateTime 2018-08-01
 * [onEnter](https://react-guide.github.io/react-router-cn/docs/API.html)
 */
const isLogin = (nextState, replaceState)=>{
    const token = util.Storage.getItem('token');
    if(!token){
        replaceState('/login');
    }
}

class Routes extends Component {
    render(){
        return (
            <Router history={browserHistory }>
                <Route path="/" component={Home} onEnter={isLogin}>
                    <Route path="List" getComponent={List}/>
                    <Route path="addPic" getComponent={addPic}/>
                    <Route path="catePic" getComponent={catePic}/>
                    <Route path="addCate" getComponent={addCate}/>
                    <Route path="editCate/:id" getComponent={editCate}/>
                    <Route path="labelList" getComponent={labelList}/>
                    <Route path="addLabel" getComponent={addLabel}/>
                    <Route path="editLabel/:id" getComponent={editLabel}/>
                </Route>
                <Route path="/login" getComponent={Login}  />
                <Route path="/register" getComponent={Register}  />
            </Router>
        )
    }
}

export default Routes;
