/**
 * 添加标签
 * @authors 我贼帅
 * @date    2018-08-27 
 */

import React,{Component} from 'react'

import {connect} from 'react-redux';

import {Linput, Button, Select, AddLabel, Upload} from '../components/form'

import {fetchAddLabel} from '../actions'

import {util, ajax} from '../utils'

import {browserHistory} from 'react-router'

import '../styles/addPic.scss'

const token = util.Storage.getItem('token');

@connect((state, props)=>{
    console.log('==========='+JSON.stringify(state)+'===========');
    return {
        config: state.config
    }
    
})

export default class addCate extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
            name: ''
      };
    }

    componentDidMount(){
        console.log(browserHistory);
    }

    handleChangeFn = (e) => {
        let name = e.name;
        let value = e.value;
        this.setState({
            [name]: value
        })
    }

    submitHandleFn = (e) => {
        console.log(e);
        e.preventDefault();
        /**
         * 检查数据
         * @type {[type]}
         */
        const values = util.Trim(this.state);
        const data = [
                {key:'标签名称',val: values.name},
                {key:'token',val: token}
            ];
        let bool = util.checkData(data);
        if(!bool){
            return;
        }
        this.props.dispatch(fetchAddLabel(values,(res)=>{
            browserHistory.replace('/labelList');
    
        }))

    }

    render(){
        return (
            <div className="content pic-content">
                <p className="title flex j-b">
                    <span className="title-name">添加图片标签</span>
                </p>
                <form className="pic-form">
                    <Linput label="标签名称" type="text" name="name" placeholder="请填写标签名称" handleChange={this.handleChangeFn}/>
                    <Button type="submit" html="添加" handleChange={this.submitHandleFn}/>
                </form>
            </div>
        )
    }
}


