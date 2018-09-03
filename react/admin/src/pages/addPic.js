/**
 * 添加图片
 * @authors 我贼帅
 * @date    2018-08-04
 */

import React, {Component} from 'react'

import {connect} from 'react-redux'

import {fetchCateList, fetchLabelList} from '../actions'

import {Linput, Button, Select, AddLabel, Upload} from '../components/form'

import '../styles/addPic.scss'

let _this;

@connect((state, props)=>{
    return {
        config: state.config
    }
    
})


export default class addPic extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
        options: [],
        Labels: [],
        title: '',
        author: '',
        source: '',
        cate: '',
        labels: [],
        path: ''
      };
    }

    componentDidMount(){
        _this = this;
        _this.getCateFn();
        _this.getLabelFn(); 
    }

    handleChangeFn = (e) => {
        let name = e.name;
        let val = e.value;
        _this.setState({
            [name]: val
        })
    }

    selectChangeFn = (e) => {
        let labels = _this.state.labels
        console.log(e);
        _this.setState({
            cate: e.value
        })
    }

    labelChangeFn = (e) => {
        console.log(e);
        if(e.checked){

        }
    }

    getCateFn = (e) => {
        _this.props.dispatch(fetchCateList({}, (res)=>{
            res.list.unshift({id:'',name:'请选择'});
            _this.setState({
                options: res.list
            })
        }))
    }

    getLabelFn = (e) => {
        _this.props.dispatch(fetchLabelList({}, (res)=>{
            _this.setState({
                Labels: res.list
            })
        }))
    }

    render(){
        return (
            <div className="pic-content">
                <h2 className="title">添加图片</h2>

                <form className="pic-form">
                    <Linput label="图片名称" type="text" name="title" placeholder="请填写图片名称" handleChange={this.handleChangeFn}/>
                    <Linput label="图片作者" type="text" name="author" placeholder="请填写图片作者" handleChange={this.handleChangeFn}/>
                    <Linput label="图片来源" type="text" name="source" placeholder="请填写图片来源" handleChange={this.handleChangeFn}/>
                    <Select label="图片分类" options={this.state.options} handleChange={this.selectChangeFn}/>
                    <AddLabel label="图片标签" labels={this.state.Labels} handleChange={this.labelChangeFn}/>
                    <Upload label="图片上传" name="file" handleChange={this.uploadChangeFn}/>
                    <Button type="submit" html="添加"/>
                </form>
            </div>
        )
    }
}


