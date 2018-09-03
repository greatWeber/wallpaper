/**
 * 页面头部组件
 * @authors 我贼帅
 * @date    2018-08-03
 */

import React, {Component} from 'react'

import {browserHistory, Link} from 'react-router'

import {fetchLogOut} from '../actions'

import '../styles/home.scss'

import {connect} from 'react-redux';

import {util} from '../utils';

@connect((state, props)=>{
    return {
        config: state.config
    }
    
})

class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {
        pathName: '',
        tab: [{name: "图片列表",current: false,path:'/List'},
            {name: "添加图片",current: false,path:'/addPic'},
            {name: "图片分类",current: false,path:'/catePic'},
            {name: "图片标签",current: false,path:'/labelList'},
            {name: "回收站",current: false,path:'/recycleBin'}],
        tabLi: null,
        userId: util.Storage.getItem('userId')
      };
    }

    
    /**
     * 渲染导航条
     * @Author   我贼帅
     * @DateTime 2018-08-08
     * @return   {[type]}   [description]
     */
    renderTab = ()=>{
        console.log(this.state);
        const pathName = browserHistory.getCurrentLocation().pathname;
        let tab = this.state.tab;
        tab.forEach((item, i)=>{
            if(item.path === pathName){
                item.current = true;

            }else{
                item.current = false;
            }
        });
        const tabLi = tab.map((item)=>{
            if(item.current){
                return <li className="header-li " key={item.path} onClick={this.barChangeFn}>
                    <Link className="header-act" to={item.path}>
                        {item.name}
                    </Link>
                </li>
            }else{
                return <li className="header-li" key={item.path} onClick={this.barChangeFn}>
                    <Link to={item.path}>
                        {item.name}
                    </Link>
                </li>
            }
        }); 
         
        this.setState({
            pathName: pathName,
            tab: tab,
            tabLi: tabLi
        })
    }

    barChangeFn = () => {
        this.renderTab();
    }

    componentDidMount(){
        console.log(browserHistory);
        this.renderTab();
        
        
    }
    /**
     * 退出登录
     * @Author   我贼帅
     * @DateTime 2018-08-08
     * @return   {[type]}   [description]
     */
    logOutFn = () => {
        this.props.dispatch(fetchLogOut({userId: this.state.userId},(res)=>{
            console.log(res);
            util.logOut();
        }))
    }

    render(){
        return (
            <header className="header">
                <div className="header-ul i-b v-m">
                    <ul className=" flex">
                        {this.state.tabLi}
                    </ul>
                </div>
                    
                <div className="userInfo fr">
                    <span className="name">用户名</span>
                    <span className="logOut" onClick={this.logOutFn}>退出</span>
                </div>
            </header>
        )
    }
}

export {
    Header
}

