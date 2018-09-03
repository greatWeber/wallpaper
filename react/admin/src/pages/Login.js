
/**
 * 后台首页
 * @Author   我贼帅
 * @DateTime 2018-07-31
 */

import React, {Component} from 'react';

import {connect} from 'react-redux';

import {Input, Button} from '../components/form'

import {util, ajax} from '../utils'

import {fetchLogin} from '../actions'

import {browserHistory} from 'react-router'

import '../styles/login.scss'




/**
 * @Author   我贼帅
 * @DateTime 2018-07-31
 * [connect](https://www.jianshu.com/p/1a2f3db4af61)
 */
@connect((state, props)=>{
    console.log('==========='+JSON.stringify(state)+'===========');
    return {
        config: state.config
    }
    
})



export default class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            userName: "",
            password: ""
        }
        this.changeInputFn = this.changeInputFn.bind(this);
    }

    componentDidMount(){
        console.log(this.props);
        console.log(browserHistory.getCurrentLocation());
    }

    changeInputFn(e){
        const name = e.name;
        const value = e.value;
        this.setState({
            [name]: value
        });
    }
    
    /**
     * 登录函数
     * @Author   我贼帅
     * @DateTime 2018-08-03
     * @param    {[type]}   e [description]
     * @return   {[type]}     [description]
     */
    handleSubmit = (e)=>{
        e.preventDefault();
        const values = util.Trim(this.state);
        const data = [
                {key:'用户名',val: values.userName},
                {key:'密码',val: values.password}
            ];
        let bool = util.checkData(data);
        if(!bool){
            return;
        }
        /**
         * dispatch --分发 action。修改State。
         * [传送门](https://github.com/berwin/Blog/issues/4)
         */
        this.props.dispatch(fetchLogin(values,(res)=>{
            console.log(res);
            const result = res.result;
            util.Storage.setItem('token',result.token,1);
            util.Storage.setItem('userName',result.name,1);
            util.Storage.setItem('userId',result.id,1);
            browserHistory.push('/List');
        }))

    }
    
    /**
     * 跳转注册
     * @Author   我贼帅
     * @DateTime 2018-08-03
     * @param    {[type]}   e [description]
     * @return   {[type]}     [description]
     */
    jumpRegister = (e) => {
        browserHistory.push('/register')
    }

    render(){
        return (
            <div className="page">
                <h1 className="title t-c">管理后台</h1>
                <form onSubmit={this.handleSubmit} className="form">
                    <Input type="text" name="userName" placeholder="请输入名称" handleChange={this.changeInputFn}/>
                    <Input type="password" name="password" placeholder="请输入密码" handleChange={this.changeInputFn}/>
                    <p className="tip" onClick={this.jumpRegister}>还没有账号，前往注册</p>
                    <Button type="submit" html="登录" handleChange={this.handleSubmit}/>
                </form>
            </div>
            
            )
    }

}
