/**
 *  图片分类列表
 * @authors 我贼帅
 * @date    2018-08-08
 */

import React, {Component} from 'react'

import {connect} from 'react-redux'

import {browserHistory} from 'react-router'

import {fetchCateList, fetchDelCate } from '../actions'

import Table from '../components/table'

import {util} from '../utils'

let _this;
@connect((state, props)=>{
    console.log('==========='+JSON.stringify(state)+'===========');
    return {
        config: state.config
    }
    
})



export default class catePic extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
        thead : [
            {width: '10%',name:'id',title:'id'},
            {width: '10%',name:'name',title:'名称'},
            {width: '20%',name:'',title:'操作'}
        ],
        tbody : [],
        operation: [
            {name:'修改',type:1},
            {name:'删除',type:2}
        ]
      };
    }

    componentDidMount(){
        _this = this;
        this.getList();
    }

    getList = () => {
        this.props.dispatch(fetchCateList({},(res)=>{
            console.log(res);
            let list = res.list;
            this.setState({
                tbody: list
            });
        }))
    }

    delFn = (e, id)=>{
        const r = window.confirm('确定删除?');
        if(r){
            console.log(id);
            
            this.props.dispatch(fetchDelCate({id: id}, (res)=>{
                alert(res.msg);
                _this.getList();
            }))
        }
    }

    editFn = (e, id) => {
        console.log(id);
        browserHistory.push(`/editCate/${id}`);

    }

    jumpAddFn = () => {
        browserHistory.push('/addCate');
    }

    render(){
        return (
                <div className="content">
                    <p className="title flex j-b">
                        <span className="title-name">图片分类列表</span>
                        <span className="title-add" onClick={this.jumpAddFn}>添加</span>
                    </p>
                    <Table thead={this.state.thead} tbody={this.state.tbody} operation={this.state.operation} delFn={this.delFn} editFn={this.editFn}/>
                </div>
            )
    }
}

