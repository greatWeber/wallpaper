/**
 * 修改图片分类
 * @authors 我贼帅
 * @date    2018-08-27
 * 
 */

import React,{Component} from 'react'

import {connect} from 'react-redux';

import {Linput, Button, Select, AddLabel, Upload} from '../components/form'

import {fetchEditCate, fetchCateDetail} from '../actions'

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
            name: '',
            id: ''
      };
    }

    componentDidMount(){
        console.log(this.props);
        const id = this.props.params.id;
        this.setState({
                id: id
            })
        this.props.dispatch(fetchCateDetail({id:id},(res)=>{
            this.setState({
                name: res.list.name
            })
        }))

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
                {key:'分类名称',val: values.name},
                {key:'id',val: values.id}
            ];
        let bool = util.checkData(data);
        if(!bool){
            return;
        }
        this.props.dispatch(fetchEditCate(values,(res)=>{
            browserHistory.replace('/catePic');
        }))

    }

    render(){
        return (
            <div className="content pic-content">
                <p className="title flex j-b">
                    <span className="title-name">修改图片分类</span>
                </p>
                <form className="pic-form">
                    <Linput label="分类名称" type="text" name="name" value={this.state.name} placeholder="请填写分类名称" handleChange={this.handleChangeFn}/>
                    <Button type="submit" html="修改" handleChange={this.submitHandleFn}/>
                </form>
            </div>
        )
    }
}



