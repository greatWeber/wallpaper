/**
 * 注册页面
 * @authors 我贼帅
 * @date    2018-08-03
 */

import React, {Component} from 'react';

import {connect} from 'react-redux';

import {Input, Button} from '../components/form'

import {util, ajax} from '../utils'

import {fetchRegister} from '../actions'

import {hashHistory} from 'react-router'

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
            password: "",
            repassword: ""
        }
        this.changeInputFn = this.changeInputFn.bind(this);
    }

    componentDidMount(){
        console.log(this.props);
    }

    changeInputFn(e){
        const name = e.name;
        const value = e.value;
        this.setState({
            [name]: value
        });
    }
    
    /**
     * 注册函数
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
                {key:'密码',val: values.password},
                {key:'确认密码',val: values.repassword}
            ];
        let bool = util.checkData(data);
        if(!bool){
            return;
        }
        /**
         * dispatch --分发 action。修改State。
         * [传送门](https://github.com/berwin/Blog/issues/4)
         */
        this.props.dispatch(fetchRegister(values,(res)=>{
            alert(res.msg)
            hashHistory.push('/login')
            // util.Storage.setItem('token',1);
        }))

    }

    render(){
        return (
            <div className="page">
                <h1 className="title t-c">管理后台</h1>
                <form onSubmit={this.handleSubmit} className="form">
                    <Input type="text" name="userName" placeholder="请输入名称" handleChange={this.changeInputFn}/>
                    <Input type="password" name="password" placeholder="请输入密码" handleChange={this.changeInputFn}/>
                    <Input type="password" name="repassword" placeholder="请输入确认密码" handleChange={this.changeInputFn}/>
                    <Button type="submit" html="注册" handleChange={this.handleSubmit}/>
                </form>
            </div>
            )
    }

}

